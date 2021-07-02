var reloadId; 
var display = document.getElementById('display');
var notice =  document.getElementById('notice');
var bpm =  document.getElementsByName("bpm")[0];
var temp =  document.getElementsByName("temp")[0];
var pos =  document.getElementsByName("pos")[0];
var alarm =  document.getElementsByName("alarm")[0];
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
            data: [0,0,0,0,0,0,0,0,0,0]
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
                    max: 37, 
                    min: 30, 
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
            data: [0,0,0,0,0,0,0,0,0,0]
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
    setInterval(test, 500);
};

var resp = [];

var test = function (){
    var request = new XMLHttpRequest();
    var latest = {};
    request.open("GET", 'update', true);
    request.send();
    
    request.onreadystatechange = function(){
        if (this.readyState==4 && this.status==200){

            resp = JSON.parse(this.response);
            resp =  resp.reverse();
            latest = resp[resp.length-1];           
            
            bpm.value =  latest.HeartRate==null? 88 :latest.HeartRate;
            temp.value =  latest.Temperature==null? 35 :latest.Temperature;
            pos.value =  latest.Position==null? "back" :latest.Position;
            if (latest.Alarm =="0" || latest.Alarm==null){
                alarm.value = "false";
            }
            else{
                alarm.value="true";
            }

            if (alarm.value=="true"){
                display.classList.replace("safe", "alarm");
            }
            else{
                display.classList.replace("alarm","safe");
            }
            
            resp.forEach(element => {
                tempdata.shift();
                tempdata.push(Number(element.Temperature));
                templabels.shift();
                templabels.push(element.Time);

                bpmdata.shift();
                bpmdata.push(Number(element.HeartRate))
                bpmlabels.shift();
                bpmlabels.push(element.Time);
            });

            tempLineGraph.update();
            bpmLineGraph.update();
            
            
            let ss = Number(latest.Time.slice(6,8))
            let mm = Number(latest.Time.slice(3,5));
            let hh = Number(latest.Time.slice(0,2));

            let t  = new Date();
            
            if ( hh== t.getHours() && mm == t.getMinutes() && ( t.getSeconds-ss< 8)){
                console.log("hidden");
                notice.style.visibility = "hidden";
                
            }
            else{
                console.log("visible");
                notice.style.visibility = "visible";
            }
        }
    };
}

reload();
