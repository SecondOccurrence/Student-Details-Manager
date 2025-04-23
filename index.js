"use strict";

const serverPath = "./js/server";

const server = require(`${serverPath}/server`);
const router = require(`${serverPath}/router`);

// Import external handler functions
const handlers = {
    start: require(`${serverPath}/handlers/start`),
    newStudent: require(`${serverPath}/handlers/newStudent`),
    searchStudent: require(`${serverPath}/handlers/searchStudent`),
    query: require(`${serverPath}/handlers/query`),
    upload: require(`${serverPath}/handlers/upload`),
    show: require(`${serverPath}/handlers/show`),
    asset: require(`${serverPath}/handlers/asset`)
};

// Define handler object to be used by the router
const handle = {
    "/": handlers.start.reqStart,
    "/new_student": handlers.newStudent.reqStudent,
    "/search_student": handlers.searchStudent.reqSearch,
    "/upload": handlers.upload.reqUpload,
    "/query": handlers.query.reqQuery,
    "/show": handlers.show.reqShow,
    "/css": handlers.asset.reqAsset,
    "/images": handlers.asset.reqAsset,
    "/js": handlers.asset.reqAsset
};

server.startServer(router.route, handle);
