// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const pdfjsLib = require('pdfjs-dist')
const https = require('https');
const glib = require("graphlib");
const START_NODE_NAME = "[[[[START_NODE]]]]"
const PDF_URL = "https://media.ignimgs.com/code-foo/2020/files/quests_for_question.pdf"

var admin = require('firebase-admin');


    //Use this for production ONLY
    admin.initializeApp()

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
                nodes: graph.nodes().map(item => ({name: item})),
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

    function getPdfUrl() {
        if (req.query.hasOwnProperty('url')) {
            return req.query.url;
        } else {
            return PDF_URL;
        }
    }


    function returnJsonError(errorText) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({
            "error": errorText
        }));
    }

    function calculateQuestsWithHighestReturns() {
        const PDF_URL = getPdfUrl();
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

                            returnJsonResponse(result);

   

                            
        
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
        }).on("error", function(error) {
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