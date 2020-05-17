 let PipeTurner = function(parameters) {
    pipeTurnerThis = this;
    this.radius = [];
    this.radiusGradient = [];
    this.helicity = [];
    this.stepLength = [];
    this.name = parameters.name || "pipeTurn_" + new Date().toISOString().replace(/:/g, "-"); 

    let download = (content, fileName, type) => {
        var a = document.createElement("a");
        var file = new Blob([content], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    this.getSTL = () => {
        let sTLstart = `solid ` + pipeTurnerThis.name;
        download(sTLstart, pipeTurnerThis.name, "application/sla" )
    }

}
export default PipeTurner