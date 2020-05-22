export let PipeBender = function(parameters) {
    let pipeBenderThis = this;
    this.radius = [];
    this.radiusGradient = [];
    this.helicity = [];
    this.stepLength = [];
    this.name = parameters?.name || "pipeBends_" + new Date().toISOString().replace(/:/g, "-"); 

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
        let sTLstart = `solid ` + pipeBenderThis.name;
        download(sTLstart, pipeBenderThis.name + ".stl", "application/sla" )
    }

}