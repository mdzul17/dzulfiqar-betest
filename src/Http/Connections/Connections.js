class Connections {
    async connect(){
        throw new Error("CONNECTION.METHOD_NOT_IMPLEMENTED");
    }
}

module.exports = Connections