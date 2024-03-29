//  index.js


    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var camera, 
        controls, 
        scene, 
        renderer;

    var lastPegman;
    var frameCount = 0;
    var mesh = undefined;
    var SELECTED = undefined;
    var seaLevel = -750;
    var followUp = false;

    var near = 0;
    var far = Infinity;
    var light0, light1, light2;
    var armature, armatureHelper;
    var font, h0, h1, h2, h3, h4, h5, h6;
    var axisCustomHelper;
    var originAxisHelper;
    var laserLight;
    var groundHelper;
    var skydome;
    var keyboard = new KeyboardState();
    var clock = new THREE.Clock();
    var helpCameraActive = false;
    var directionSphere;
    var speed = 1.9;
    var materialArray = [];

    var listener = new THREE.AudioListener();
    var soundClick = new THREE.Audio( listener );

    var reloadText = new THREE.Mesh();
    var reloadTextGeom;
    var reloadTextWidth;
    var reloadText;

    var projector;
    var raycaster;
    var mouse = new THREE.Vector2();

    var sect = 0;
    var intersects = [];
    var morphs = [];
    var skins = [];
    var pegmen = [];
    var targets = [];
    var directionRandomPoints = [];

    THREE.AnimationHandler.animations = [];

    var animation;
    var avatarHelper;
    var myAvatar;
    var shootedEnemy;
    var othersAvatar;
    var xforward = true;
    var zforward = true;

    var pauser = $("#pauser")[0];
    var container = $("#render-container")[0]; // important!
    var pegmanResultbar = $("#pegman-result-bar")[0];
    var innerHtml = "<p style='font-size:1em;'>PAUSED</p><p>Click to continue...</p><p style='font-size:0.5em;'>anywhere3d.com</p>";

    var currentIndex = 0;
    var googleResults = [];
    var googleCapacity = 100;

    var geometry = {};
    var materials = [];

    const skydomePath = "skydomes/skydome002.jpg";
    const pegmanPath  = "models/human_walk_0_female.js";

//  watch.js

    var intersectWatcher = { a:null }; // important!
    watch( intersectWatcher, "a", function(prop, action, newvalue, oldvalue){
        if ( intersects[0] && intersects[0].object.userData.result ) {
            pegmanResultbar.innerHTML = intersects[0].object.userData.result.innerHTML;
            modifyLinks( pegmanResultbar );
        }
    });

    const data = {

        "fps":25,
        "name":"walk",
        "length":1.000000,

        "hierarchy":[

            {"parent":-1,"keys":[
                {"time":0.000000,"pos":[0.000000,-0.238009,-0.149781],"rot":[-0.000000,0.130526,0.000000,0.991445],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.000000,-0.123622,-0.149781],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":0.500000,"pos":[0.000000,-0.238009,-0.149781],"rot":[-0.000000,-0.130526,-0.000000,0.991445]},
                {"time":0.750000,"pos":[0.000000,-0.123622,-0.149781],"rot":[0.000000,-0.000000,0.000000,1.000000]},
                {"time":1.000000,"pos":[0.000000,-0.238009,-0.149781],"rot":[-0.000000,0.130526,0.000000,0.991445],"scl":[1,1,1]}
            ]},

            {"parent":0,"keys":[
                {"time":0.000000,"pos":[0.000000,-0.637143,0.032442],"rot":[0.000000,-0.258819,-0.000000,0.965926],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.000000,-0.637143,0.032442],"rot":[-0.000000,0.000000,0.000000,1.000000]},
                {"time":0.500000,"pos":[0.000000,-0.637143,0.032442],"rot":[0.000000,0.258819,0.000000,0.965926]},
                {"time":0.750000,"pos":[0.000000,-0.637143,0.032442],"rot":[-0.000000,-0.000000,-0.000000,1.000000]},
                {"time":1.000000,"pos":[0.000000,-0.637143,0.032442],"rot":[0.000000,-0.258819,-0.000000,0.965926],"scl":[1,1,1]}
            ]},

            {"parent":1,"keys":[
                {"time":0.000000,"pos":[-0.179328,-0.423980,0.016705],"rot":[0.108760,-0.009303,0.005096,0.994011],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.179328,-0.423980,0.016705],"rot":[-0.130402,0.005694,0.043246,0.990501]},
                {"time":0.500000,"pos":[-0.179328,-0.423980,0.016705],"rot":[-0.189554,-0.117614,0.005793,0.974783]},
                {"time":0.750000,"pos":[-0.179328,-0.423980,0.016705],"rot":[-0.000000,0.000000,0.043619,0.999048]},
                {"time":1.000000,"pos":[-0.179328,-0.423980,0.016705],"rot":[0.108760,-0.009303,0.005096,0.994011],"scl":[1,1,1]}
            ]},

            {"parent":2,"keys":[
                {"time":0.000000,"pos":[-0.082591,-0.946297,0.032376],"rot":[0.345882,0.045890,-0.065526,0.934861],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.082591,-0.946297,0.032376],"rot":[0.459992,-0.040244,0.000001,0.887011]},
                {"time":0.500000,"pos":[-0.082591,-0.946297,0.032376],"rot":[0.023619,-0.001014,0.002650,0.999717]},
                {"time":0.750000,"pos":[-0.082591,-0.946297,0.032376],"rot":[-0.000000,0.000000,-0.000000,1.000000]},
                {"time":1.000000,"pos":[-0.082591,-0.946297,0.032376],"rot":[0.223510,0.057704,-0.040897,0.972132],"scl":[1,1,1]}
            ]},

            {"parent":3,"keys":[
                {"time":0.000000,"pos":[-0.093297,-1.058145,-0.081906],"rot":[-0.000000,-0.000000,-0.043619,0.999048],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.093297,-1.058145,-0.081906],"rot":[-0.000000,-0.000000,-0.043619,0.999048]},
                {"time":0.500000,"pos":[-0.093297,-1.058145,-0.081906],"rot":[0.129714,0.000097,-0.028719,0.991136]},
                {"time":0.750000,"pos":[-0.093297,-1.058145,-0.081906],"rot":[0.000000,-0.000000,-0.043619,0.999048]},
                {"time":1.000000,"pos":[-0.093297,-1.058145,-0.081906],"rot":[-0.000000,-0.000000,-0.043619,0.999048],"scl":[1,1,1]}
            ]},

            {"parent":4,"keys":[
                {"time":0.000000,"pos":[-0.004168,-0.104198,0.278802],"rot":[-0.139216,0.000000,0.000000,0.990262],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.004168,-0.104198,0.278802],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":0.500000,"pos":[-0.004168,-0.104198,0.278802],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":0.750000,"pos":[-0.004168,-0.104198,0.278802],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":1.000000,"pos":[-0.004168,-0.104198,0.278802],"rot":[-0.139216,0.000000,0.000000,0.990262],"scl":[1,1,1]}
            ]},

            {"parent":5,"keys":[
                {"time":0.000000,"pos":[0.179328,-0.423980,0.016705],"rot":[-0.189554,0.117614,-0.005793,0.974783],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.179328,-0.423980,0.016705],"rot":[-0.000000,-0.000000,-0.043619,0.999048]},
                {"time":0.500000,"pos":[0.179328,-0.423980,0.016705],"rot":[0.108760,0.009303,-0.005096,0.994011]},
                {"time":0.750000,"pos":[0.179328,-0.423980,0.016705],"rot":[-0.130402,-0.005694,-0.043246,0.990501]},
                {"time":1.000000,"pos":[0.179328,-0.423980,0.016705],"rot":[-0.186294,0.069695,0.013896,0.979921],"scl":[1,1,1]}
            ]},

            {"parent":6,"keys":[
                {"time":0.000000,"pos":[0.082591,-0.946298,0.032376],"rot":[0.023619,0.001014,-0.002650,0.999717],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.082591,-0.946298,0.032376],"rot":[0.000000,0.000000,-0.000000,1.000000]},
                {"time":0.500000,"pos":[0.082591,-0.946298,0.032376],"rot":[0.345882,-0.045890,0.065526,0.934861]},
                {"time":0.750000,"pos":[0.082591,-0.946298,0.032376],"rot":[0.459992,0.040244,-0.000001,0.887011]},
                {"time":1.000000,"pos":[0.082591,-0.946298,0.032376],"rot":[0.023619,0.001014,-0.002650,0.999717],"scl":[1,1,1]}
            ]},

            {"parent":7,"keys":[
                {"time":0.000000,"pos":[0.093298,-1.058144,-0.081906],"rot":[0.129714,-0.000097,0.028719,0.991136],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.093298,-1.058144,-0.081906],"rot":[0.000000,0.000000,0.043619,0.999048]},
                {"time":0.500000,"pos":[0.093298,-1.058144,-0.081906],"rot":[0.000000,-0.000000,0.043619,0.999048]},
                {"time":0.750000,"pos":[0.093298,-1.058144,-0.081906],"rot":[0.000000,-0.000000,0.043619,0.999048]},
                {"time":1.000000,"pos":[0.093298,-1.058144,-0.081906],"rot":[0.129714,-0.000097,0.028719,0.991136],"scl":[1,1,1]}
            ]},

            {"parent":8,"keys":[
                {"time":0.000000,"pos":[0.004168,-0.104198,0.278802],"rot":[0.000000,0.000000,0.000000,1.000000],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.004168,-0.104198,0.278802],"rot":[-0.000000,-0.000000,-0.000000,1.000000]},
                {"time":0.500000,"pos":[0.004168,-0.104198,0.278802],"rot":[-0.139216,-0.000000,-0.000000,0.990262]},
                {"time":0.750000,"pos":[0.004168,-0.104198,0.278802],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":1.000000,"pos":[0.004168,-0.104198,0.278802],"rot":[0.000000,0.000000,0.000000,1.000000],"scl":[1,1,1]}
            ]},

            {"parent":9,"keys":[
                {"time":0.000000,"pos":[-0.308734,-0.019827,-0.035159],"rot":[-0.184894,0.000088,0.641420,0.744576],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.308734,-0.019827,-0.035159],"rot":[-0.111619,-0.133022,0.696364,0.696364]},
                {"time":0.500000,"pos":[-0.308734,-0.019827,-0.035159],"rot":[-0.064000,-0.211520,0.610282,0.760736]},
                {"time":0.750000,"pos":[-0.308734,-0.019827,-0.035159],"rot":[-0.111619,-0.133022,0.696364,0.696364]},
                {"time":1.000000,"pos":[-0.308734,-0.019827,-0.035159],"rot":[-0.246871,0.058257,0.622176,0.740646],"scl":[1,1,1]}
            ]},

            {"parent":10,"keys":[
                {"time":0.000000,"pos":[-0.651609,0.035223,-0.005975],"rot":[-0.021024,0.186285,-0.001146,0.982270],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.651609,0.035223,-0.005975],"rot":[-0.004639,0.096647,-0.011052,0.995247]},
                {"time":0.500000,"pos":[-0.651609,0.035223,-0.005975],"rot":[-0.001300,0.014862,-0.040989,0.999048]},
                {"time":0.750000,"pos":[-0.651609,0.035223,-0.005975],"rot":[-0.004639,0.096647,-0.011052,0.995247]},
                {"time":1.000000,"pos":[-0.651609,0.035223,-0.005975],"rot":[-0.016353,0.143518,-0.000645,0.989512],"scl":[1,1,1]}
            ]},

            {"parent":11,"keys":[
                {"time":0.000000,"pos":[-0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":0.500000,"pos":[-0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":0.750000,"pos":[-0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":1.000000,"pos":[-0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000],"scl":[1,1,1]}
            ]},

            {"parent":12,"keys":[
                {"time":0.000000,"pos":[-0.255625,0.011264,0.018285],"rot":[0.013719,0.004943,0.124938,0.992057],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.255625,0.011264,0.018285],"rot":[0.013719,0.004943,0.124938,0.992057]},
                {"time":0.500000,"pos":[-0.255625,0.011264,0.018285],"rot":[0.013719,0.004943,0.124938,0.992057]},
                {"time":0.750000,"pos":[-0.255625,0.011264,0.018285],"rot":[0.013719,0.004943,0.124938,0.992057]},
                {"time":1.000000,"pos":[-0.255625,0.011264,0.018285],"rot":[0.013719,0.004943,0.124938,0.992057],"scl":[1,1,1]}
            ]},

            {"parent":13,"keys":[
                {"time":0.000000,"pos":[-0.108779,0.002097,0.005320],"rot":[0.021844,0.007870,0.198927,0.979739],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.108779,0.002097,0.005320],"rot":[0.021844,0.007870,0.198927,0.979739]},
                {"time":0.500000,"pos":[-0.108779,0.002097,0.005320],"rot":[0.021844,0.007870,0.198927,0.979739]},
                {"time":0.750000,"pos":[-0.108779,0.002097,0.005320],"rot":[0.021844,0.007870,0.198927,0.979739]},
                {"time":1.000000,"pos":[-0.108779,0.002097,0.005320],"rot":[0.021844,0.007870,0.198927,0.979739],"scl":[1,1,1]}
            ]},

            {"parent":14,"keys":[
                {"time":0.000000,"pos":[-0.099108,-0.009695,0.096749],"rot":[-0.050973,-0.455554,0.234661,0.857208],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.099108,-0.009695,0.096749],"rot":[-0.050973,-0.455554,0.234661,0.857208]},
                {"time":0.500000,"pos":[-0.099108,-0.009695,0.096749],"rot":[-0.050973,-0.455554,0.234661,0.857208]},
                {"time":0.750000,"pos":[-0.099108,-0.009695,0.096749],"rot":[-0.050973,-0.455554,0.234661,0.857208]},
                {"time":1.000000,"pos":[-0.099108,-0.009695,0.096749],"rot":[-0.050973,-0.455554,0.234661,0.857208],"scl":[1,1,1]}
            ]},

            {"parent":15,"keys":[
                {"time":0.000000,"pos":[-0.028998,0.003394,0.110154],"rot":[-0.046211,-0.088421,0.063526,0.992981],"scl":[1,1,1]},
                {"time":0.250000,"pos":[-0.028998,0.003394,0.110154],"rot":[-0.046211,-0.088421,0.063526,0.992981]},
                {"time":0.500000,"pos":[-0.028998,0.003394,0.110154],"rot":[-0.046211,-0.088421,0.063526,0.992981]},
                {"time":0.750000,"pos":[-0.028998,0.003394,0.110154],"rot":[-0.046211,-0.088421,0.063526,0.992981]},
                {"time":1.000000,"pos":[-0.028998,0.003394,0.110154],"rot":[-0.046211,-0.088421,0.063526,0.992981],"scl":[1,1,1]}
            ]},

            {"parent":16,"keys":[
                {"time":0.000000,"pos":[0.000000,0.184153,0.045771],"rot":[0.000000,-0.130526,-0.000000,0.991445],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.000000,0.184153,0.045771],"rot":[-0.000000,-0.000000,-0.000000,1.000000]},
                {"time":0.500000,"pos":[0.000000,0.184153,0.045771],"rot":[0.000000,0.130526,0.000000,0.991445]},
                {"time":0.750000,"pos":[0.000000,0.184153,0.045771],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":1.000000,"pos":[0.000000,0.184153,0.045771],"rot":[0.000000,-0.130526,-0.000000,0.991445],"scl":[1,1,1]}
            ]},

            {"parent":17,"keys":[
                {"time":0.000000,"pos":[0.308734,-0.019827,-0.035159],"rot":[-0.064000,0.211520,-0.610282,0.760736],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.308734,-0.019827,-0.035159],"rot":[-0.111619,0.133022,-0.696364,0.696364]},
                {"time":0.500000,"pos":[0.308734,-0.019827,-0.035159],"rot":[-0.184894,-0.000088,-0.641420,0.744576]},
                {"time":0.750000,"pos":[0.308734,-0.019827,-0.035159],"rot":[-0.111619,0.133022,-0.696364,0.696364]},
                {"time":1.000000,"pos":[0.308734,-0.019827,-0.035159],"rot":[-0.034275,0.236309,-0.592200,0.769599],"scl":[1,1,1]}
            ]},

            {"parent":18,"keys":[
                {"time":0.000000,"pos":[0.651609,0.035223,-0.005975],"rot":[-0.001300,-0.014862,0.040989,0.999048],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.651609,0.035223,-0.005975],"rot":[-0.004639,-0.096647,0.011052,0.995247]},
                {"time":0.500000,"pos":[0.651609,0.035223,-0.005975],"rot":[-0.021024,-0.186285,0.001146,0.982270]},
                {"time":0.750000,"pos":[0.651609,0.035223,-0.005975],"rot":[-0.004639,-0.096647,0.011052,0.995247]},
                {"time":1.000000,"pos":[0.651609,0.035223,-0.005975],"rot":[-0.001300,-0.014862,0.040989,0.999048],"scl":[1,1,1]}
            ]},

            {"parent":19,"keys":[
                {"time":0.000000,"pos":[0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":0.500000,"pos":[0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":0.750000,"pos":[0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000]},
                {"time":1.000000,"pos":[0.536570,0.024136,0.034739],"rot":[0.000000,0.000000,0.000000,1.000000],"scl":[1,1,1]}
            ]},

            {"parent":20,"keys":[
                {"time":0.000000,"pos":[0.255625,0.011264,0.018285],"rot":[0.013719,-0.004943,-0.124938,0.992057],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.255625,0.011264,0.018285],"rot":[0.013719,-0.004943,-0.124938,0.992057]},
                {"time":0.500000,"pos":[0.255625,0.011264,0.018285],"rot":[0.013719,-0.004943,-0.124938,0.992057]},
                {"time":0.750000,"pos":[0.255625,0.011264,0.018285],"rot":[0.013719,-0.004943,-0.124938,0.992057]},
                {"time":1.000000,"pos":[0.255625,0.011264,0.018285],"rot":[0.013719,-0.004943,-0.124938,0.992057],"scl":[1,1,1]}
            ]},

            {"parent":21,"keys":[
                {"time":0.000000,"pos":[0.108779,0.002097,0.005320],"rot":[0.021844,-0.007870,-0.198927,0.979739],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.108779,0.002097,0.005320],"rot":[0.021844,-0.007870,-0.198927,0.979739]},
                {"time":0.500000,"pos":[0.108779,0.002097,0.005320],"rot":[0.021844,-0.007870,-0.198927,0.979739]},
                {"time":0.750000,"pos":[0.108779,0.002097,0.005320],"rot":[0.021844,-0.007870,-0.198927,0.979739]},
                {"time":1.000000,"pos":[0.108779,0.002097,0.005320],"rot":[0.021844,-0.007870,-0.198927,0.979739],"scl":[1,1,1]}
            ]},

            {"parent":22,"keys":[
                {"time":0.000000,"pos":[0.099108,-0.009695,0.096749],"rot":[-0.050972,0.455554,-0.234661,0.857208],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.099108,-0.009695,0.096749],"rot":[-0.050972,0.455554,-0.234661,0.857208]},
                {"time":0.500000,"pos":[0.099108,-0.009695,0.096749],"rot":[-0.050972,0.455554,-0.234661,0.857208]},
                {"time":0.750000,"pos":[0.099108,-0.009695,0.096749],"rot":[-0.050972,0.455554,-0.234661,0.857208]},
                {"time":1.000000,"pos":[0.099108,-0.009695,0.096749],"rot":[-0.050972,0.455554,-0.234661,0.857208],"scl":[1,1,1]}
            ]},

            {"parent":23,"keys":[
                {"time":0.000000,"pos":[0.028998,0.003394,0.110154],"rot":[-0.046210,0.088421,-0.063526,0.992981],"scl":[1,1,1]},
                {"time":0.250000,"pos":[0.028998,0.003394,0.110154],"rot":[-0.046210,0.088421,-0.063526,0.992981]},
                {"time":0.500000,"pos":[0.028998,0.003394,0.110154],"rot":[-0.046210,0.088421,-0.063526,0.992981]},
                {"time":0.750000,"pos":[0.028998,0.003394,0.110154],"rot":[-0.046210,0.088421,-0.063526,0.992981]},
                {"time":1.000000,"pos":[0.028998,0.003394,0.110154],"rot":[-0.046210,0.088421,-0.063526,0.992981],"scl":[1,1,1]}
            ]},

        ],

    };


    init(container);

    animate();

    function init( container ) {

        camera = new THREE.PerspectiveCamera( 50, container.offsetWidth / container.offsetWidth, 1, 100000 );
        camera.position.set( 200, 10, 0 );
        camera.rotation.set( 0, 0, 0, "XYZ" );
        camera.name = "CAMERA"

        scene = new THREE.Scene();
        projector = new THREE.Projector();
        controls = new THREE.EditorControls(camera);
        camera.lookAt(controls.center);

        (function(){
            light0 = newDirectionalLight(0xffffff, 0, 0, 1000, 0.5);
            light1 = newDirectionalLight(0xffffff, 1000, 0, -1000, 0.5);
            light2 = newDirectionalLight(0xffffff, -1000, 1000, 1000, 0.25);
            light3 = newDirectionalLight(0xffffff, 0, -1000, 0, 0.25);
        })();

        //  Laser light.
        (function(){
            laserLight = new THREE.PointLight( 0x00ff44, 0.1, 10 );
            laserLight.position.copy( camera.position );
            laserLight.intensity = 2;
            laserLight.name = "LASERPOINTER"
            scene.add( laserLight );
        })();

        //  Skydome.
        (function(){
            var loader = new THREE.TextureLoader();
            var texture = loader.load( skydomePath );
            skydome = new THREE.Mesh( 
                new THREE.SphereGeometry( 10000, 64, 32 ), 
                new THREE.MeshBasicMaterial( {
                    color: 0xffffff,
                    map: texture,
                    side: THREE.DoubleSide
                })
            );
            skydome.scale.set(-1, 0.5, 1);
            skydome.name = "SKYDOME";
            scene.add(skydome);
        })();

        //  Renderer.
        (function(){

            renderer = new THREE.WebGLRenderer({ 
                antialias:true, 
                preserveDrawingBuffer:false, 
            });

            renderer.shadowMap.enabled = true;
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( container.offsetWidth, container.offsetHeight ); 
            container.appendChild( renderer.domElement );

            //  Event Listeners.
            window.addEventListener( "resize", onWindowResize, false );
            container.addEventListener( "mousedown", onDocumentMouseDown, false );
            container.addEventListener( "mouseup", onDocumentMouseUp, false );
            container.addEventListener( "mousemove", onDocumentMouseMove, false );
            //  container.addEventListener( "dblclick", onDocumentClick, false );
            container.addEventListener( "mousedown", onPegmanClickHandler, false );
            document.body.addEventListener( "onbeforeunload", onDocumentBeforeUnload );

        })();

        (function(){
            var loader = new THREE.JSONLoader();
            loader.load( pegmanPath, function ( gmt, mtl ) {
                geometry = gmt;   // important! global.
                materials = mtl;  // important! global.
                debugMode && console.log("geometry:", geometry);
                debugMode && console.log("materials:", materials);
                //  Create 100 dummy pegmen.
                for (var i=0; i < 50; i++) {
                    createResultPegman();
                }
                camera.lookAt(pegmen[0].position); // optional!
            });
        })();

        onWindowResize();

    }

    function animate(){
        requestAnimationFrame( animate );
        render();
        update();
    }

    function render(){
        renderer.render( scene, camera );
    }

    function onWindowResize() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( container.offsetWidth, container.offsetHeight );
    }

    function onDocumentMouseMove( event ) {
        //  Use container.innerWidth/Height when renderer container is full window.
        //mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        //mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        //  Use container.offsetWidth/Height when renderer container is not full window.
        mouse.x = ( event.clientX / container.offsetWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / container.offsetHeight ) * 2 + 1;
    }

    function onDocumentMouseDown( event ) {
        event.preventDefault();
        followUp = true;
    }

    function onDocumentMouseUp( event ) {
        event.preventDefault();
        followUp = false;
    }

    function onDocumentClick( event ) {
        event.preventDefault();

        if ( !!intersects[0] ) {
            var link = document.createElement("a");
            link.href = intersects[0].object.userData.href;
            link.target = "_blank";
            link.onclick = function(){ document.body.removeChild(link) };
            document.body.appendChild(link);
            link.click();
        }
    }

    function onPegmanClickHandler(){

        var cameraUnprojected = new THREE.Vector3();
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        cameraUnprojected = vector.unproject( camera );
        var ray  = new THREE.Raycaster( 
            camera.position, 
            vector.sub( camera.position ).normalize(), 
            near, 
            far 
        );

        intersects = ray.intersectObjects( targets );

        if ( !!intersects[0] && !!controls ) {
            //  console.log(intersects[0]);
            //  Follow intersects[0] pegman.
            controls.focus(intersects[0].object, true); 
        }
    }

    function update() {

        var delta = clock.getDelta();
        var	time = clock.getElapsedTime();

        //  if (!!lastPegman) controls.focus(lastPegman, followUp);
        //  if (!!skydome) skydome.position.copy(camera.position);

        if (keyboard) keyboard.update( delta * speed );
        if (avatarHelper) avatarHelper.update( delta * speed );

        var cameraUnprojected = new THREE.Vector3();
        //  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        var vector = new THREE.Vector3( 0, 0, 1 );
        cameraUnprojected = vector.unproject( camera );
        var ray  = new THREE.Raycaster( 
            camera.position, vector.sub( camera.position ).normalize(), near, far 
        );

        intersects = ray.intersectObjects( targets );

        if ( intersects[0] ) {

            //  Follow intersects[0] pegman.
            if ( !!controls ) {
                controls.focus(intersects[0].object, true); 
                //  console.log(intersects[0]);
            }

        }

        intersectWatcher.a = !!intersects[0] && intersects[0].object.uuid; // important!

        /*
            //  Show link in bottom result bar.
            if ( !!intersects[0].object.userData.result ) {
                pegmanResultbar.innerHTML = intersects[0].object.userData.result.innerHTML;
                modifyLinks( pegmanResultbar );
            }
        */

        THREE.AnimationHandler.update( delta * speed );

        for ( var i in pegmen ) {
            if (  zforward ) pegmen[i].translateZ(  Math.cos(delta) );   // +x moving // zforward = true;
            if ( !zforward ) pegmen[i].translateZ( -Math.cos(delta) );   // -x moving // zforward = false;
            if (  xforward ) pegmen[i].translateX( -Math.sin(delta) );   // +z moving // xforward = true;
            if ( !xforward ) pegmen[i].translateX(  Math.sin(delta) );   // -z moving // xforward = false;
            pegmen[i].lookAt( directionRandomPoints[i] );

            if ( Math.ceil( pegmen[i].position.x ) == directionRandomPoints[i].x 
                || Math.ceil(pegmen[i].position.z) == directionRandomPoints[i].z ) {
                directionRandomPoints[i] = new THREE.Vector3(
                    THREE.Math.randInt( -200, 200 ), 
                    pegmen[i].position.y, 
                    THREE.Math.randInt( -200, 200 ) 
                );
            }
        }

    }

    function modifyLinks( rootElement ){
        var links = getNodeListAsArray( rootElement, "a" ); 
        links.forEach( function( item, idx ) {

            //  Remove string from "&sa=..." to end.
            links[ idx ].href = item.href.split("&sa=")[0];

            //  Change origin to google origin.
            links[ idx ].href = links[ idx ].href.replace(/http\:\/\/localhost\:4000/g, "http://www.google.com");

            //  debugMode && console.log( "modifyLinks a.href:", links[ idx ].href );
            item.addEventListener("mouseup", function(e){ 
                e.currentTarget.target = "_blank"; 
            }, true);
        });

    }

    function changeSkydome( url ){
        var loader = new THREE.TextureLoader();
        loader.setCrossOrigin( undefined );
        loader.load( url, 
                    function(texture){
            skydome.material.map = texture;
            skydome.material.map.needsUpdate = true;
            skydome.material.needsUpdate = true;
        }, 
                    function(xhr){
            debugMode && console.log(xhr);
        }, 
                    function(err){
            debugMode && console.log(err);
        } 
                   );
    }

    //  PEGMEN FUNCTIONS.

    function removePegmen(){

        scene.remove.apply(scene, pegmen);  //  important!

        //  Animations.
        while (THREE.AnimationHandler.animations.length){
            THREE.AnimationHandler.animations.shift().stop();
        }

        while (pegmen.length){
            (function(){
                var item = pegmen.shift();
                //  Dispose geometry. 
                //  item.geometry.dispose(); // (Geometry is the same uuid so we do not dispose geometry.)
                //  Dispose materials;
                for ( var i = 0; i < item.material.materials.length; i++ ) {
                    item.material.materials[i].dispose();
                }
            })();
        }

        //  Reset lists.
        morphs.length = 0;
        skins.length = 0;
        pegmen.length = 0;
        targets.length = 0;
        intersects.length = 0;
        directionRandomPoints.length = 0;
        THREE.AnimationHandler.animations.length = 0;

    }

    /*
        pegmen.forEach(function(item, index){
            //  scene.remove(item);
            //  Dispose geometry. (Geometry is the same uuid so we do not dispose geometry.)
            //  item.geometry.dispose();
            //  Dispose materials;
            for ( var i = 0; i < item.material.materials.length; i++ ) {
                item.material.materials[i].dispose();
            }
        });
    */

    function resetRuntime(){

        //  Clean up animations.
        THREE.AnimationHandler.animations.length = 0;

        //  Reset lists.
        morphs.length = 0;
        skins.length = 0;
        pegmen.length = 0;
        targets.length = 0;
        intersects.length = 0;
        directionRandomPoints.length = 0;

    }

    function pegman_init(options) {

        var loader = new THREE.JSONLoader();
        loader.load( pegmanPath, function ( geometry, materials ) {
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();

            for ( var i = 0, j = materials.length; i < j; i ++ ) {
                var originalMaterial = materials[i];
                materials[i].skinning = true;
                materials[i].map = undefined;
                materials[i].shading = THREE.SmoothShading;
                materials[i].color.setRGB( 1, 1, 1 );
                materials[i].specular.setRGB( Math.random(), Math.random(), Math.random() );
                materials[i].shininess = 75;
            }

            var material = new THREE.MeshFaceMaterial( materials );
            var pegman = new THREE.SkinnedMesh( geometry, material, false );

            var s = 5;  pegman.scale.set( s, s, s );

            pegman.rotation.y = THREE.Math.randFloatSpread( Math.PI ); // direction of the avatar ?
            pegman.position.x = THREE.Math.randInt( -200, 200 );
            pegman.position.z = THREE.Math.randInt( -200, 200 );
            pegman.position.y = -geometry.boundingBox.min.y * s ;

            initPegman = pegman;
        });
    }

    function createResultPegman( result ){
        //   if (!result) return;
        //  console.log("geometry:", geometry, "material:", materials);

        geometry.computeVertexNormals();
        geometry.computeBoundingBox();

        for ( var i = 0; i < materials.length; i++ ) {
            materials[i].skinning = true;
            materials[i].map = null;
            materials[i].shading = THREE.SmoothShading;
            materials[i].color.setRGB(Math.random(),Math.random(),Math.random());
            materials[i].specular.setRGB( 1,1,1 );
            materials[i].shininess = 75;
            materials[i].needsUpdate = true;
        }

        var material = new THREE.MeshFaceMaterial( materials );
        var pegman = new THREE.SkinnedMesh( geometry, material.clone(), false );

        var s = 5;  pegman.scale.set( s, s, s );

        pegman.rotation.y = THREE.Math.randFloatSpread( Math.PI ); // direction of the avatar ?
        pegman.position.x = THREE.Math.randInt( -200, 200 );
        pegman.position.z = THREE.Math.randInt( -200, 200 );
        pegman.position.y = -geometry.boundingBox.min.y * s ;

        //  Result data.
        if (!!result) {
            pegman.userData.result = result;
            pegman.userData.textContent = result.textContent;
            var a = getNodeListAsArray( result, "h3.r a" )[0];      // result.getElementsByClassName("r")[0].getElementsByTagName("a")[0];
            if (a) pegman.name = a.innerText;
            if (a) pegman.userData.href = a.href;
            if (a) pegman.userData.title = a.innerText;
            var st = getNodeListAsArray( result, "div.r .st" )[0];  // result.getElementsByClassName("s")[0].getElementsByClassName("st")[0];
            if (st) pegman.userData.summery = st.innerText;
        }

        //  Add to scene.
        scene.add( pegman );
        skins.push( pegman );
        pegmen.push( pegman );
        targets.push( pegman );

        lastPegman = pegman;

        //  Create the animation.
        animation = new THREE.Animation( pegman, data );
        animation.play();
        animation.update( 0 );

        //	Ensure Loop. // ensureLoop( geometry.animation );
        for ( var i = 0; i < data.hierarchy.length; i ++ ) {
            var bone = data.hierarchy[ i ];
            var first = bone.keys[ 0 ];
            var last = bone.keys[ bone.keys.length - 1 ];
            last.pos = first.pos;
            last.rot = first.rot;
            last.scl = first.scl;
        }

        var directionRandomPoint = new THREE.Vector3( 
            THREE.Math.randInt( -200, 200 ), 
            pegman.position.y, 
            THREE.Math.randInt( -200, 200 ) 
        );

        directionRandomPoints.push( directionRandomPoint );

    }

    function ensureLoop( animation ) {
        for ( var i = 0; i < animation.hierarchy.length; i ++ ) {
            var bone = animation.hierarchy[ i ];
            var first = bone.keys[ 0 ];
            var last = bone.keys[ bone.keys.length - 1 ];
            last.pos = first.pos;
            last.rot = first.rot;
            last.scl = first.scl;
        }
    }

    function loadJsonMeshFile( pathname ){
        var object;
        var loader = new THREE.JSONLoader();
        loader.load( pathname, function(geometry, materials) {
            var material = new THREE.MeshFaceMaterial(materials);
            object = new THREE.Mesh(geometry, material);
            object.scale.set(1, 1, 1);
            object.position.set(0, 0, 0);
            object.rotation.set(0, 0, 0);
            scene.add(object);
        });
        return object;
    }

    //  SCENE FUNCTIONS.
    function newFpsCameraControls( camera ){
        var controls = new THREE.FirstPersonControls( camera );
        controls.movementSpeed = 200;
        controls.lookSpeed = 0.05;
        controls.noFly = true;
        controls.autoForward = false;
        controls.lookVertical = false;
        controls.enabled = true;
        return controls;
    }

    function newDirectionalLight(hexcolor, x, y, z, intensity){
        var light = new THREE.DirectionalLight( hexcolor );
        light.position.set( x, y, z );
        light.intensity = intensity;
        scene.add( light );
        return light;
    }

    //  CONTROLS SWITCH.
    function controlsEnableDisable(){
        if (controls.enabled) disableControls();
        else enableControls();
    }

    function disableControls(){
        controls.enabled = false;
        //if ( pauser ) pauser.style.display = "";
        //if ( pauser ) pauser.innerHTML = innerHtml;
    }

    function enableControls(){
        controls.enabled = true;
        //if ( pauser ) pauser.style.display = "none";
    }

    function toggleVisible(object){
        object.visible = !object.visible;
    }

    function toggleSkydome(){
        skydome.visible = !skydome.visible;
        groundHelper.visible = !skydome.visible;
        axisCustomHelper.visible = !skydome.visible;
        originAxisHelper.visible = !skydome.visible;
    }

    //  CAMERA MEASUREMENTS
    function propertiesCapturer(){
        document.getElementById("framer").innerHTML = frameCount;
        document.getElementById("cam-pos-x").innerHTML = camera.position.x.toFixed(3);
        document.getElementById("cam-pos-y").innerHTML = camera.position.y.toFixed(3);
        document.getElementById("cam-pos-z").innerHTML = camera.position.z.toFixed(3);
        document.getElementById("cam-rot-x").innerHTML = camera.rotation._x.toFixed(3);
        document.getElementById("cam-rot-y").innerHTML = camera.rotation._y.toFixed(3);
        document.getElementById("cam-rot-z").innerHTML = camera.rotation._z.toFixed(3);
        document.getElementById("cam-quat-w").innerHTML = camera.quaternion._w.toFixed(3);
        document.getElementById("cam-quat-x").innerHTML = camera.quaternion._x.toFixed(3);
        document.getElementById("cam-quat-y").innerHTML = camera.quaternion._y.toFixed(3);
        document.getElementById("cam-quat-z").innerHTML = camera.quaternion._z.toFixed(3);
        document.getElementById("cam-far").innerHTML = camera.far;
        document.getElementById("cam-fov").innerHTML = camera.fov;
        document.getElementById("mouse-x").innerHTML = mouse.x.toFixed(3);
        document.getElementById("mouse-y").innerHTML = mouse.y.toFixed(3);
        document.getElementById("intersects").innerHTML = intersects.length;
    }

    //  HELPERS.
    function newGroundHelper(){
        var grid = new THREE.GridHelper( 1000, 10, 0x444444, 0x444444 );
        grid.name = "GRID"
        grid.position.y = 0;
        scene.add( grid );
        return grid;
    }

    function newCustomAxisHelper(){
        var group = new THREE.Group();

        scene.add(group);
        group.name = "AXIS";

        //  Lines.
        var geometryAxisXpos = new THREE.Geometry();
        var geometryAxisXneg = new THREE.Geometry();
        var geometryAxisYpos = new THREE.Geometry();
        var geometryAxisYneg = new THREE.Geometry();
        var geometryAxisZpos = new THREE.Geometry();
        var geometryAxisZneg = new THREE.Geometry();

        var materialAxisXpos = new THREE.LineBasicMaterial( {color: 0xff0000} );
        var materialAxisXneg = new THREE.LineBasicMaterial( {color: 0xff0000} );
        var materialAxisYpos = new THREE.LineBasicMaterial( {color: 0x00ff00} );
        var materialAxisYneg = new THREE.LineBasicMaterial( {color: 0x00ff00} );
        var materialAxisZpos = new THREE.LineBasicMaterial( {color: 0x0000ff} );
        var materialAxisZneg = new THREE.LineBasicMaterial( {color: 0x0000ff} );

        geometryAxisXpos.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 1200, 0, 0 ) );
        geometryAxisXneg.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3(-1200, 0, 0 ) );
        geometryAxisYpos.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1200, 0 ) );
        geometryAxisYneg.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0,-1200, 0 ) );
        geometryAxisZpos.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 1200 ) );
        geometryAxisZneg.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0,-1200 ) );

        var lineAxisXpos = new THREE.Line( geometryAxisXpos, materialAxisXpos );
        var lineAxisXneg = new THREE.Line( geometryAxisXneg, materialAxisXneg );
        var lineAxisYpos = new THREE.Line( geometryAxisYpos, materialAxisYpos );
        var lineAxisYneg = new THREE.Line( geometryAxisYneg, materialAxisYneg );
        var lineAxisZpos = new THREE.Line( geometryAxisZpos, materialAxisZpos );
        var lineAxisZneg = new THREE.Line( geometryAxisZneg, materialAxisZneg );

        group.add( lineAxisXpos );
        group.add( lineAxisXneg );
        //group.add( lineAxisYpos );
        //group.add( lineAxisYneg );
        group.add( lineAxisZpos );
        group.add( lineAxisZneg );

        return group;
    }

    function deselectSELECTED(){
        if ( SELECTED ) {
            if ( SELECTED.children[0] ) SELECTED.children[0].visible = false;
            SELECTED.selected = false;
            SELECTED = null;
        }
    }

    function wildcardAnyObjectAndChild( object, callback ){
        // callback: function(item, index){};
        // Find any children of an object and object itself.

        if ( object && callback ){

            //  Object itself.
            if ( !(object instanceof THREE.Scene) ) callback( object );

            //  Object children.
            if ( object.children ) object.children.forEach( function( item, index ){
                wildcardAnyObjectAndChild( item, callback );
            });

        } else {

            if ( !object ) debugMode && console.error( "wildcardAnyObjectAndChild:", "object is not defined:", object );
            if ( !callback ) debugMode && console.error( "wildcardAnyObjectAndChild:", "object is not defined:", callback );
        }
    }

    function convertingFromBufferGeometry( object ){
        debugMode && console.log("converting from buffer geometry:", object);
        if( object.children ) {
            for( child in object.children ) {
                object.children[child].geometry = new THREE.Geometry().fromBufferGeometry( object.children[child].geometry );
                debugMode && console.log(child, object.children[child].name);
            }
        }
    }

    function creatingSelectedEdgesHelpers( object ){
        debugMode && console.log("creating selected edges helpers:", object);
        if( object.children ) {
            for( child in object.children ) {
                object.children[child].add( new THREE.EdgesHelper( object.children[child], 0x00ff00, 1 ) );
                debugMode && console.log(child, object.children[child].name);
            }
        }
    }

    function loadTexture( url, mapping, onLoad, onError ) {
        //  console.warn( "THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead." );
        function onLoad(txr){}
        function onProgress(xhr){}
        function onError(err){}
        var loader = new THREE.TextureLoader();
        loader.setCrossOrigin( undefined );
        var texture = loader.load( url, onLoad, onProgress, onError );
        if ( mapping ) texture.mapping = mapping;
        return texture;
    }

    function onDocumentBeforeUnload(event) {
        //  Remove pegmen from memory.

        //  Dispose geometry.
        if ( geometry ) {
            geometry.dispose();
            render = function (){};
            update = function (){};
            animate = function (){};
        }

        //  Dispose materials.
        pegmen.forEach(function(item, index){
            scene.remove(item);
            //  Dispose materials;
            if ( item.material ) {
                if ( item.material.materials ) {
                    for ( var i in item.material.materials ) {
                        item.material.materials[i].dispose();
                    }
                } else {
                    item.material.dispose();
                }
            }
        });
    }
