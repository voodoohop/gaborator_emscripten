

// function onRuntimeInitialized() {
  
const em_module = require('./wrap_gaborator.js');

// async function getWrapper() {

//     const m = em_module();
//     console.log(m.then);    
//     const module= await m;
//     console.log(module);
//     return module;
// }

// async function testGaborator() {
//     const wrapper = await getWrapper();
//     wrapper._sayHi();
// }

// testGaborator();

const loader = require('audio-loader')

const m = em_module();

    m.then(({ThomashGaborator}) => {
        // console.log(Object.keys(Module.ThomashGaborator))
        // Module._analyze(Float32Array.from([0,1,0,0.5]));


        console.log(ThomashGaborator);


        loader("./media/ZOOM0037.wav").then(audio =>   {
            const gaborator= new ThomashGaborator(audio.sampleRate);
            const data = audio.getChannelData(0);
            gaborator.analyze(data,function(real,imag,band,t)  {console.log("resuult",{real,imag,band,t});});
            console.log(data.length)
        })
        .catch(e => console.error(e));
        
        // const data=new Float32Array(44100).fill(1.0)    ;

    })
    // console.log  .log(em_module._sayHi()); // direct calling works


// Module['onRuntimeInitialized'] = onRuntimeInitialized;


// em_module.ccall("sayHi"); // using ccall etc. also work
// console.log(em_module._daysInWeek()); // values can be returned, etc.