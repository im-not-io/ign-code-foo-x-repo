// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const pdfjsLib = require('pdfjs-dist')
const https = require('https');
const glib = require("graphlib");
const START_NODE_NAME = "[[[[START_NODE]]]]"
const PDF_URL = "https://media.ignimgs.com/code-foo/2020/files/quests_for_question.pdf"

var admin = require('firebase-admin');

const cors = require('cors')({
    origin: true,
});


//Use this for production ONLY
admin.initializeApp();

// //Comment out for debug mode ONLY
// admin.initializeApp({
// credential: admin.credential.applicationDefault(),
// databaseURL: 'https://code-foo-x-firebase.firebaseio.com/'
// });
// ////////////////////////////////////


exports.calculateBestQuests = functions.https.onRequest(async (req, res) => {

    var Graph = glib.Graph;

    function sortByStartDate(list) {
        return (list.sort(function (a, b) {
            if (a.start_date > b.start_date) {
                return 1;
            } else if (a.start_date < b.start_date) {
                return -1;
            } else {
                return 0;
            }
        }));
    }

    function buildQuestGraph(quests) {
        let graph = new Graph({
            directed: true
        });
        graph.setNode(START_NODE_NAME, START_NODE_NAME);
        for (let index = 0; index < quests.length; index = index + 1) {
            let currentQuest = quests[index];
            let currentQuestLabel = currentQuest.quest;
            graph.setNode(currentQuestLabel, currentQuestLabel);
            graph.setEdge(START_NODE_NAME, currentQuestLabel, currentQuest.reward);
            for (let innerIndex = 0; innerIndex < quests.length; innerIndex = innerIndex + 1) {
                let comparisonQuest = quests[innerIndex];
                if (comparisonQuest.start_date >= currentQuest.end_date) {
                    let currentQuestLabel = currentQuest.quest;
                    let comparisonQuestLabel = comparisonQuest.quest;
                    graph.setNode(comparisonQuestLabel, comparisonQuestLabel);
                    graph.setEdge(currentQuestLabel, comparisonQuestLabel, comparisonQuest.reward);
                }
            }
        }
        return graph;
    }

    function createObjectWithDefaults(keys, fillValue) {
        let obj = {};
        for (let index = 0; index < keys.length; index = index + 1) {
            obj[keys[index]] = fillValue;
        }
        return obj;
    }

    function findBestEndVertex(graph, distances) {
        let maximumReward = Number.NEGATIVE_INFINITY;
        let maxEndVertex;
        let topologicalOrder = glib.alg.topsort(graph);
        for (let index = 0; index < topologicalOrder.length; index = index + 1) {
            let currentVertex = graph.node(topologicalOrder[index]);
            let successors = graph.successors(topologicalOrder[index]);
            for (let successorIndex = 0; successorIndex < successors.length; successorIndex = successorIndex + 1) {
                let successorVertex = graph.node(successors[successorIndex]);
                let currentToSuccessorEdgeWeight = graph.edge(currentVertex, successorVertex);
                if (distances[successorVertex] < distances[currentVertex] + currentToSuccessorEdgeWeight) {
                    distances[successorVertex] = distances[currentVertex] + currentToSuccessorEdgeWeight;
                }
                if (distances[successorVertex] > maximumReward) {
                    maximumReward = distances[successorVertex];
                    maxEndVertex = successorVertex;
                }
            }
        }
        return maxEndVertex;
    }

    function removeAndReturnMaxDistance(distances) {
        let maxDistance = Number.NEGATIVE_INFINITY;
        let maxKey;
        for (let [key, value] of Object.entries(distances)) {
            if (value > maxDistance) {
                maxDistance = value;
                maxKey = key;
            }
        }
        delete distances[maxKey];
        return maxKey;
    }

    function findMaximumPath(graph, pathEndVertex, distances) {
        let mostExpensivePath = [{
            quest: pathEndVertex,
            earnedRupees: graph.edge(graph.inEdges(pathEndVertex)[0])
        }];
        let currentVertex = graph.node(pathEndVertex);

        while (currentVertex != START_NODE_NAME) {
            let predecessors = graph.predecessors(currentVertex);
            let maxEntry;
            while (!predecessors.includes(maxEntry)) {
                //Find the predecessor that holds the highest
                //cost
                maxEntry = removeAndReturnMaxDistance(distances);
            }

            let inEdges = graph.inEdges(maxEntry);

            if (inEdges.length >= 1) {
                mostExpensivePath.push({
                    quest: maxEntry,
                    earnedRupees: graph.edge(inEdges[0])
                });
            }


            currentVertex = maxEntry;
        }

        return mostExpensivePath.reverse();
    }

    function findOptimalQuestSequence(quests) {

        //O(q^2) where q is the number of quests
        let sorted = sortByStartDate(quests);

        //O(q^2) where q is the number of quests
        let graph = buildQuestGraph(sorted);

        console.assert(glib.alg.isAcyclic(graph) === true);

        let vertices = graph.nodes();

        let distances = createObjectWithDefaults(vertices, Number.NEGATIVE_INFINITY);

        distances[START_NODE_NAME] = 0;

        //O(V + E) time complexity because of the topological sort
        let endVertex = findBestEndVertex(graph, distances);
        let maxDistance = distances[endVertex];

        let maxPath = findMaximumPath(graph, endVertex, distances);

        return {
            maxPath: maxPath,
            maxDistance: maxDistance,
            graph: {
                nodes: graph.nodes().map(item => ({
                    name: item
                })),
                edges: graph.edges().map(edge => ({
                    source: edge.v,
                    target: edge.w,
                    label: graph.edge(edge)
                }))
            },


        }

    }

    function returnJsonResponse(obj) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(obj));
    }

    // function getPdfUrl() {
    //     if (req.query.hasOwnProperty('url')) {
    //         return req.query.url;
    //     } else {
    //         return PDF_URL;
    //     }
    // }


    function returnJsonError(errorText) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": errorText
        }));
    }

    function getPdfUrl() {
        return admin.database().ref("activeDatasetUrl/").once("value")
        .then((dataSnapshot) => {
            console.log("datasnap ready")
            return dataSnapshot.val();
        });
    }

    async function calculateQuestsWithHighestReturns() {
        const PDF_URL = await getPdfUrl();
        console.log("res url", PDF_URL);
        const PDF_PAGE = 1;
        const NUMBER_OF_PDF_COLUMNS = 7

        try {
            https.get(PDF_URL, function (res) {
                var data = [];
                res.on('data', function (chunk) {
                    data.push(chunk);
                }).on('end', function () {
                    //at this point data is an array of Buffers
                    //so Buffer.concat() can make us a new Buffer
                    //of all of them together
                    var buffer = Buffer.concat(data);
                    var loadingTask = pdfjsLib.getDocument(buffer);

                    loadingTask.promise.then(function (pdf) {
                        //wait until PDF is ready to be read
                        pdf.getPage(PDF_PAGE).then(function (page) {
                            //wait until page is ready to be read
                            page.getTextContent().then(function (textContent) {
                                let quests = [];

                                //textContent contains information about the PDF's text data
                                //if we access textContent.items we'll get a bunch of objects
                                //that contain information about the PDF's text objects
                                //including the value of the text which we access by doing
                                //textContent.items[item].str. See the pdf.js docs for more
                                //info: https://mozilla.github.io/pdf.js/examples/index.html#interactive-examples

                                //This for loop extracts data from the PDF a row at a time,
                                //creates a quest object from it, and appends the quest
                                //into an array which holds all the quests
                                for (let index = NUMBER_OF_PDF_COLUMNS; index < textContent.items.length; index = index + 7) {
                                    let quest = {
                                        "quest": String(textContent.items[index].str), //quest name (converted to string just in case)
                                        "start_date": parseInt(textContent.items[index + 1].str), //quest start date (converted to number)
                                        "end_date": parseInt(textContent.items[index + 1].str) + parseInt(textContent.items[index + 2].str), //quest duration
                                        "reward": parseInt(textContent.items[index + 3].str) //quest reward (converted to number)
                                    }
                                    quests.push(quest);
                                }


                                let result = findOptimalQuestSequence(quests);
                                result.source = PDF_URL;

                                admin.database().ref("/" + "questCalculatorResult").set(result)
                                .then(() => {
                                    returnJsonResponse({
                                        "result": "The quest calculator result was successfully written to the database."
                                    });
                                })
                                .catch(() => {
                                    returnJsonError("The data failed to write to the database.")
                                });







                            }).catch(err => {
                                console.log(err);
                                returnJsonError("The PDF provided couldn't be read.");
                            });
                        }).catch(err => {
                            console.log(err);
                            returnJsonError("The PDF provided couldn't be read.");
                        });
                    }).catch(err => {
                        console.log(err);
                        returnJsonError("The PDF provided couldn't be read.");
                    });
                });
            }).on("error", function (error) {
                console.log(error.message);
                returnJsonError("There was an issue retrieving the PDF from the server.");
            });
        } catch (error) {
            if (error instanceof TypeError) {
                returnJsonError("The URL entered doesn't appear to be valid.");
            }
        }

    }



    calculateQuestsWithHighestReturns();


});

exports.users = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        const jsonBody = req.body;
        
        function deleteUserFromFirebase(uid) {
            admin.auth().deleteUser(uid)
            .then(function() {
                console.log('Successfully deleted user');
                res.status(200).send({
                    "result": "User deletion successful."
                });
            })
            .catch(function(error) {
                console.log('Error deleting user:', error);
            });
            admin.database().ref("users/" + uid)
            .remove()
            .then(function() {
                console.log("Remove succeeded.")
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });
        }

        if (!(req.method === 'POST' || req.method === 'DELETE')) {
            res.status(405).send({
                "error": "This endpoint only supports POST and DELETE methods."
            });
        }

        if (Object.keys(jsonBody["idToken"]).length === 0 && jsonBody["idToken"].constructor === Object) {
            //verify that the client is providing POST or GET data
            res.status(400).send({
                "error": "No data was received in the request."
            });
        } else {

            admin.auth().verifyIdToken(jsonBody["idToken"])
                .then(function (decodedToken) {
                    let signedInUserId = decodedToken.uid;
                    admin.database().ref("users/" + signedInUserId + "/role").once("value", function(snapshot) {
                        const role = snapshot.val();
                        if (!(role === "administrator" || role === "owner")) {
                            res.status(401).send({
                                "error": "You must be an administrator to access this functionality"
                            });
                        }
                    }).catch((error) => {
                        console.log("error");
                        console.log(error);
                    });
                    //Otherwise user must have correct privileges
                    if (req.method === 'POST') {
                        admin.auth().createUser({
                                email: jsonBody["email"],
                                password: jsonBody["password"]
                            })
                            .then(function (userRecord) {
                                admin.database().ref("users/" + userRecord.uid).set({
                                    "name": jsonBody["name"],
                                    "role": "administrator",
                                    "email": userRecord.email
                                })
                                .then(() => {
                                    res.status(200).send({
                                        "message": "User successfully created."
                                    });
                                }).catch((error) => {
                                    res.status(500).send({
                                        "error": "Failed to write the user to database."
                                    });
                                });
                            })
                            .catch(function (error) {
                                res.status(500).send({
                                    "error": error.message
                                });
                            });
                    }
                    if (req.method === 'DELETE') {
                        console.log("requesting delete for uid", jsonBody["deleteUser"]);

                        admin.database().ref("users/" + jsonBody["deleteUser"] + "/role").once("value", function(snapshot) {
                            const role = snapshot.val();
                            if (role === "owner") {
                                res.status(401).send({
                                    "error": "Owner may not be deleted."
                                });
                            } else {
                                deleteUserFromFirebase(jsonBody["deleteUser"])
                            }
                        }).catch((error) => {
                            console.log("error");
                            console.log(error);
                        });
                    }
     


                }).catch(function (error) {
                    console.log(error);
                    res.status(401).send({
                        "error": "The user's auth state couldn't be determined."
                    });
                });

        }

    });
});
