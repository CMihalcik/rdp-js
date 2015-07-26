var series2_1 = [
    [2,2],
    [2.5,2.5],
    [3,3],
    [3.5,3.5],
    [4,4],
    [4.5,3.5],
    [5,3],
    [5.5,2.5],
    [6,2]];

var series2_0 = [
    [2,2],
    [2,2.5],
    [3,3],
    [3.5,3.5],
    [4,4],
    [4.5,3.5],
    [5,3],
    [7,2.75],
    [6,2]];

var series2_0_simplified_0_25 = simplify(series2_0, 0.25);
var series2_0_simplified_1 = simplify(series2_0, 1);
var series2_0_simplified_1_75 = simplify(series2_0, 1.75);

var data1 = [series2_0, series2_0_simplified_0_25, series2_0_simplified_1, series2_0_simplified_1_75];

var jqp = $.jqplot('chartdiv',data1, {animate: false, sortData: false});

function distanceFromALine(point, line) {
    var x0 = point[0],
        y0 = point[1],
        indexOfLastPoint = line.length-1,
        x1 = line[0][0],
        y1 = line[0][1],
        x2 = line[indexOfLastPoint][0],
        y2 = line[indexOfLastPoint][1];
    //console.log('distance from a line', x0, y0, x1, y1, x2, y2)
    var numerator = Math.abs( ((y2-y1)*x0) - ((x2-x1)*y0) + (x2*y1) - (y2*x1) );
    var denominator = Math.sqrt( Math.pow((y2-y1),2) + Math.pow((x2-x1),2) );
    return numerator / denominator;
}
//test
//console.log(distanceFromALine([4, 4], [[2, 2], [6, 2]]))
//console.log(distanceFromALine([2.5, 2.5], [[2, 2], [6, 2]]))

function farthestPoint(line) {
    var candidates = line.slice(1,-1);
    var farthest = candidates.reduce( function(p,c, i) {
        //console.log("p: " + p);
        //console.log("c: " + c)
        var distance = distanceFromALine(c, line);
        //console.log("d: " + distance);
        
        if (p.distance > distance) {
            return p;
        } else {
            return {index: i, distance: distance};
        }
        
    }, {index: undefined, distance: 0});
    
    //console.log('f: ', farthest)
    return farthest;
}
//console.log(farthestPoint(series2_0))

function simplify(line, tollerance) {
    //console.log('line: ', JSON.stringify(line))
    if (line.length <= 2) {
        return line;
    }
    var fp = farthestPoint(line);
    //console.log('farthestPoint', fp)
    if (fp.distance <= tollerance) {
        // drop any remaining points
        return [line[0], line[line.length-1]];
    } else {
        var firstLine = line.slice(0,fp.index+2),
            secondLine = line.slice(fp.index+1);
        //console.log('firstLine', JSON.stringify(firstLine));
        //console.log('secondLine', JSON.stringify(secondLine));
        var simplifiedFirstLine = simplify(firstLine, tollerance),
            simplifiedSecondLine = simplify(secondLine, tollerance);            
            //console.log('sfirstLine', JSON.stringify(simplifiedFirstLine));
            //console.log('ssecondLine', JSON.stringify(simplifiedSecondLine));
        return simplifiedFirstLine.concat(simplifiedSecondLine.slice(1));
    }
}
// test
//console.log(JSON.stringify(simplify([[1,1],[2,2],[3,3]], 1)))
//console.log(JSON.stringify(simplify(series2_0, 1)))
