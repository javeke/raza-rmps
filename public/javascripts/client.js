var reloadId; 
var bpm =  document.getElementsByName("bpm")[0];
var temp =  document.getElementsByName("temp")[0];
var pos =  document.getElementsByName("pos")[0];
var tempGraph = document.getElementById('temp-graph').getContext('2d');
var bpmGraph = document.getElementById('bpm-graph').getContext('2d');

var tempLineGraph = new Chart(tempGraph, {
    type:'line',
    data:{
        labels:['','','','','','','','','',''],
        datasets:[{
            label:'Patient Temperature',
            borderWidth:2,
            backgroundColor: 'rgba(0, 0, 200, 0)',
            borderColor: 'rgba(0, 0, 200, 0.6)',
            data: [35]
        }]
    },
    options:{
        responsive: true,
        scales:{
            yAxes:[{
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature (C)',
                    fontSize: 14,
                    fontColor: 'black'
                },
                ticks:{ 
                    max: 40, 
                    min: 25, 
                    stepSize: 1 
                }
            }]
        }
    }
});

var bpmLineGraph = new Chart(bpmGraph, {
    type:'line',
    data:{
        labels:['','','','','','','','','',''],
        datasets:[{
            label:'Patient Heart Rate',
            borderWidth:2,
            backgroundColor: 'rgba(200, 0, 0, 0)',
            borderColor:'rgba(200, 0, 0, 0.6)',
            data: [35]
        }]
    },
    options:{
        responsive: true,
        scales:{
            yAxes:[{
                scaleLabel: {
                    display: true,
                    labelString: 'Heart Rate (bpm)',
                    fontSize: 14,
                    fontColor: 'black'
                },
                ticks:{ 
                    max: 100, 
                    min: 70, 
                    stepSize: 1 
                }
            }]
        }
    }
});


var templabels =tempLineGraph.data.labels;
var tempdata = tempLineGraph.data.datasets[0].data;

var bpmlabels =bpmLineGraph.data.labels;
var bpmdata = bpmLineGraph.data.datasets[0].data;

var reload = function(){
    reloadId = setInterval(test, 500);
};

var test = function (){
    var request = new XMLHttpRequest();
    request.open("GET", 'update', true);
    request.send();
    
    request.onreadystatechange = function(){
        if (this.readyState==4 && this.status==200){
            let resp = JSON.parse(this.response);
            bpm.value =  resp.bpm==null? 88 :resp.bpm;
            temp.value =  resp.temp==null? 35 :resp.temp;
            pos.value =  resp.pos==null? "back" :resp.pos;
        }
    };
    
    if(tempdata.length<6){
        bpmdata.push(bpm.value);
        tempdata.push(temp.value);
    }
    else{
        
        templabels.shift();
        templabels.push('');
        
        bpmlabels.shift();
        bpmlabels.push(''); 
        
        tempdata.shift();
        tempdata.push(temp.value); 
        
        bpmdata.shift();
        bpmdata.push(bpm.value);
    }
    tempLineGraph.update();
    bpmLineGraph.update();
}

reload();