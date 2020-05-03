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


// //Use this for production ONLY
admin.initializeApp();


// var serviceAccount = require("/Users/macandcheese/Desktop/FirebaseAdminJson/code-foo-x-firebase-firebase-adminsdk-rrwkq-9155fc933b.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://code-foo-x-firebase.firebaseio.com"
// });

exports.calculateBestQuests = functions.https.onRequest(async (req, res) => {

    function getPdfUrl() {
        //Read the active URL from Firebase and
        //return it for later use
        return admin.database().ref("activeDatasetUrl/").once("value")
        .then((dataSnapshot) => {
            return dataSnapshot.val();
        });
    }

    async function calculateQuestsWithHighestReturns() {
        //wait until the PDF URL is fetched from the database
        //and ready
        const PDF_URL = await getPdfUrl();

        //Assume that the quest data of the PDF is on the first
        //page of the PDF. A future improvement could be to support
        //mutliple page PDFs
    
        const PDF_PAGE = 1;

        //The original quest document provided seven columns:
        //Quest, Start Date, Duration (in days), Reward (in rupees),
        //Difficulty, Location, and Quest Giver. The parser assumes
        //for simplicity that there are always seven columns and
        //that they are ordered in the order listed above.

        const NUMBER_OF_PDF_COLUMNS = 7

        try {
            //Make a request to a foreign server to get the binary
            //data of the PDF
            https.get(PDF_URL, function (res) {
                var data = [];
                res.on('data', function (chunk) {
                    //push our binary data into an array as we get it
                    data.push(chunk);
                }).on('end', function () {
                    //at this point data is an array of Buffers
                    //so Buffer.concat() can make us a new Buffer
                    //of all of them together
                    var buffer = Buffer.concat(data);

                    //now we pass that buffer to the PDF.js library
                    //so it can parse the PDF
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
                                //textContent.items[index].str. See the pdf.js docs for more
                                //info:
                                //https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html

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

                                //Now we've got a list of quest objects that JavaScript can understand
                                //so we pass this to findOptimalSequence which will run the algorithm
                                //to find the quest sequence that earns the most rupees. The function
                                //returns an object that contains an array of quests to take that will
                                //earn Link the most money, the most money Link can earn, and the graph
                                //that was used to calculate the most lucrative quest sequence.
                                
                                let result = findOptimalQuestSequence(quests);

                                //Here I'm just adding in the URL used by the calculator and the creation
                                //time on the server since I use those in the UI on the client side.

                                result.source = PDF_URL;
                                result.creationTimeMilliseconds = Date.now();

                                //Once we have found our quest calculator result we'll write it to the
                                //database. It will be stored as JSON in the Firebase realtime database
                                admin.database().ref("/" + "questCalculatorResult").set(result)
                                .then(() => {
                                    //Return a JSON response so the client knows the write was successful
                                    returnJsonResponse({
                                        "result": "The quest calculator result was successfully written to the database."
                                    });
                                })
                                .catch(() => {
                                    //Return JSON error to client
                                    returnJsonError("The data failed to write to the database.")
                                });
                            }).catch(err => {
                                //Return JSON error to client
                                returnJsonError("The PDF provided couldn't be read.");
                            });
                        }).catch(err => {
                            //Return JSON error to client
                            returnJsonError("The PDF provided couldn't be read.");
                        });
                    }).catch(err => {
                       //Return JSON error to client
                        returnJsonError("The PDF provided couldn't be read.");
                    });
                });
            }).on("error", function (error) {
                //Return JSON error to client
                returnJsonError("There was an issue retrieving the PDF from the server.");
            });
        } catch (error) {
            if (error instanceof TypeError) {
                //Return JSON error to client
                returnJsonError("The URL entered doesn't appear to be valid.");
            }
        }

    }


    function findOptimalQuestSequence(quests) {

        //sort the quests by start date to make it easier to calculate
        //which quests can and cannot be taken
        let sorted = sortByStartDate(quests);

        
        let graph = buildQuestGraph(sorted);

        //just an assertion to help prevent bugs. The graph
        //must be acyclic
        console.assert(glib.alg.isAcyclic(graph) === true);

        //get all the vertices in the graph
        let vertices = graph.nodes();

        //create an object with a key for each vertex setting it to negative infinity
        let distances = createObjectWithDefaults(vertices, Number.NEGATIVE_INFINITY);

        //Set the distance to the start node to 0. (It costs us zero to arrive at the
        //start vertex)
        distances[START_NODE_NAME] = 0;

        //Find the vertex we would end at if we were to take the sequence
        //of quests that would earn Link the most money

        let endVertex = findBestEndVertex(graph, distances);

        //The rupees that would be earned if the most lucrative
        //quest sequence is taken
        let maxDistance = distances[endVertex];

        //Get the path of quests to take that would make Link earn
        //the most money.
        let maxPath = findMaximumPath(graph, endVertex, distances);


        //return the most lucrative quests to take (maxPath)
        //the most rupees that can be earned (maxDistance)
        //and the graph used to calculate those two values (graph)
        //in a JavaScript object
        return {
            maxPath: maxPath,
            maxDistance: maxDistance,
            graph: {
                nodes: graph.nodes().map(item => ({
                    //Just using map to rename the object to use
                    //the name key as used by the client-side
                    name: item
                })),
                edges: graph.edges().map(edge => ({
                    //Likewise using map to return an object with
                    //the correct keys as used by the client-side
                    source: edge.v,
                    target: edge.w,
                    label: graph.edge(edge)
                }))
            },


        }

    }

    function buildQuestGraph(quests) {
        //create a directed graph data stucture to store
        //the quest data in
    
        let graph = new glib.Graph({
            directed: true
        });

        //create a start vertex which serves as the first vertex
        //in the graph
        graph.setNode(START_NODE_NAME, START_NODE_NAME);

        for (let index = 0; index < quests.length; index = index + 1) {
            let currentQuest = quests[index];
            let currentQuestLabel = currentQuest.quest;

            //create a vertex for every quest
            graph.setNode(currentQuestLabel, currentQuestLabel);

            //Create an edge from the start vertex to the current vertex
            //since the start vertex can lead to any quest vertex.
            graph.setEdge(START_NODE_NAME, currentQuestLabel, currentQuest.reward);

            for (let innerIndex = 0; innerIndex < quests.length; innerIndex = innerIndex + 1) {
                let comparisonQuest = quests[innerIndex];
                if (comparisonQuest.start_date >= currentQuest.end_date) {
                    //if we find a quest that can lead to another quest
                    //add that quest and the edge that leads to it
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

        //I use the algorithm described here: https://www.geeksforgeeks.org/find-longest-path-directed-acyclic-graph/.
        //Please consult it if my explanations seem confusing.

        //topogically sort the graph to assure we visit the nodes
        //in the correct order.
        let topologicalOrder = glib.alg.topsort(graph);
        for (let index = 0; index < topologicalOrder.length; index = index + 1) {
            //for each vertex in the graph in topological order

            //Get the current vertex's value
            let currentVertex = graph.node(topologicalOrder[index]);

            //Get the successors of the current vertex (the vertices that can be reached from
            //the current vertex)
            let successors = graph.successors(topologicalOrder[index]);
            for (let successorIndex = 0; successorIndex < successors.length; successorIndex = successorIndex + 1) {
                //Get the value of the successor vertex
                let successorVertex = graph.node(successors[successorIndex]);

                //Get the weight of the current vertex to the successor
                //the weight represents the amount earned in rupees
                let currentToSuccessorEdgeWeight = graph.edge(currentVertex, successorVertex);
                if (distances[successorVertex] < distances[currentVertex] + currentToSuccessorEdgeWeight) {
                    //If we find a most expensive path to a particular vertex update our distances to
                    //reflect that
                    distances[successorVertex] = distances[currentVertex] + currentToSuccessorEdgeWeight;
                }
                if (distances[successorVertex] > maximumReward) {
                    //Keep track of the maximum reward and maximum vertex for
                    //later use
                    maximumReward = distances[successorVertex];
                    maxEndVertex = successorVertex;
                }
            }
        }

        //Return final vertex that we would end at in our most lucrative path sequence.
        //This is the last quest taken in the most lucrative path sequence.
        return maxEndVertex;
    }

    function removeAndReturnMaxDistance(distances) {
        let maxDistance = Number.NEGATIVE_INFINITY;
        let maxKey;
        for (let [key, value] of Object.entries(distances)) {
            if (value > maxDistance) {
                //find the vertex with the biggest distnace
                maxDistance = value;
                maxKey = key;
            }
        }

        //remove the vertex with the greatest distance
        //and return its key
        delete distances[maxKey];
        return maxKey;
    }

    function findMaximumPath(graph, pathEndVertex, distances) {
        //We already know the vertex we'll end at
        //so I add that here
        let mostExpensivePath = [{
            quest: pathEndVertex,
            earnedRupees: graph.edge(graph.inEdges(pathEndVertex)[0])
        }];

        //set the current vertex to the last item/quest in the most
        //lucrative quest sequence
        let currentVertex = graph.node(pathEndVertex);

        //keep finding the most expensive edge that leads
        //to the current vertex
        while (currentVertex != START_NODE_NAME) {
            let predecessors = graph.predecessors(currentVertex);
            let maxEntry;
            while (!predecessors.includes(maxEntry)) {
                //Find the predecessor that holds the highest
                //cost and return its key/the quest name
                maxEntry = removeAndReturnMaxDistance(distances);
            }

            //Get the edges that lead to the maxEntry
            let inEdges = graph.inEdges(maxEntry);

            if (inEdges.length >= 1) {
                //while we have incoming edges
                //push the most expensive quest
                //onto our most expensive path
                mostExpensivePath.push({
                    quest: maxEntry,
                    earnedRupees: graph.edge(inEdges[0])
                });
            }

            //change the current vertex to the next vertex that
            //would earn the most rupees
            currentVertex = maxEntry;
        }

        //This algorithm give us the most expensive path in reverse
        //order so we have to reverse it.
        return mostExpensivePath.reverse();
    }

    function sortByStartDate(list) {
        //sorts quests by ascending order based
        //on start date
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
        //Returns JSON to the client and provides an
        //HTTP 400 Bad Request error code.
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": errorText
        }));
    }

    //This is the entry point. This runs the quest calculation
    //function whenever the server receives a request regardless of
    //the HTTP verb.
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
