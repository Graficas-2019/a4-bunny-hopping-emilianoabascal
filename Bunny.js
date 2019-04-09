// 1. Enable shadow mapping in the renderer.
// 2. Enable shadows and set shadow parameters for the lights that cast shadows.
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows.
// 3. Indicate which geometry objects cast and receive shadows.
var renderer = null,
scene = null,
camera = null,
root = null,
ring = null,
bunnyObj = null,
madafakinBunnyAnimator = null,
animateMadafakinBunny = true,
group = null,
bunnyGroup = null,
orbitControls = null;
var rotations  = [];
var positionsArray = [];
var keyArray = [];
var loopAnimation = false;
var duration = 10; // sec
var objLoader = null;

var currentTime = Date.now();



function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'Stanford_Bunny_OBJ-JPG/20180310_KickAir8P_UVUnwrapped_Stanford_Bunny.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_g005c.jpg');
            var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');
            var specularMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');

            object.traverse( function ( child )
            {
                if ( child instanceof THREE.Mesh )
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                    child.material.specularMap = specularMap;
                }
            } );

            bunnyObj = object;
            bunnyObj.scale.set(40,40,40);
            bunnyObj.position.z = 0;
            bunnyObj.position.x = 0;
            bunnyObj.position.y = -3;
            bunnyObj.rotation.x = Math.PI / 180;
            bunnyObj.rotation.y = 0;
            bunnyGroup.add(bunnyObj);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        });
}

function animate() {
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    

}

function run() {
    
        requestAnimationFrame(function() { run(); });
            // Render the scene
            renderer.render( scene, camera );

            // Update the animations
            KF.update();
            // Update the camera controller
            orbitControls.update();
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;

    light.color.setRGB(r, g, b);
}

var ambientLight = null;
var pointLight = null;
var mapUrl = "images/checker_large.gif";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 2, 4000 );
    camera.position.set(0, 40, 190);
    scene.add(camera);


    root = new THREE.Object3D;
    bunnyGroup = new THREE.Object3D;


    ambientLight = new THREE.AmbientLight (0x000000);
    root.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff, 1.5, 0);
    pointLight.position.set(0,10,0);

    pointLight.castShadow = true;

    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 100;
    pointLight.shadow.camera.fov = 90;

    pointLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    var pointLightHelper = new THREE.PointLightHelper( pointLight, 1.1 );
    root.add(pointLight);
    root.add(pointLightHelper);
    // Create the objects
    loadObj();
    getKeysPositionsAndRotations();
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);
    var color = 0xffffff;

    // var asteroid = new THREE.Object3D();
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;

    // Add the mesh to our group
    mesh.position.y = -3;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    // Add the  mesh to our group
    group.add(mesh);
    // Now add the group to our scene
    scene.add(root);
    scene.add(bunnyGroup);
}

function getKeysPositionsAndRotations(){   
    iterator = duration * 30;
    var start = iterator/4;
    var sum = iterator + start;
    var lol = 360/iterator;
    var timeDivisor = duration/10/sum;
    var rotationValue = 0;
    var y = 0; 
    var x = 0;
    var z = 0;
    var flag = false; 
    for (i = start; i <= sum; i++){  
        if (flag){
            y -= 0.5
            if(y <= -1){
                flag = false;
            }
        }
        if(!flag){
            y += 0.5
            if(y >= 4){
                flag = true;
            }
        }
        x = ((Math.cos(((lol * i)) * Math.PI / 180)) * (30));
        z = ((Math.sin(((lol * i)) * Math.PI / 90)) * 10);
        positionsArray.push({'x':x,'y':y,'z': z });
        keyArray.push(i * timeDivisor);
    }
    positionsArray.push({'x':0,'y':-3,'z': 0 });
    keyArray.push(start * timeDivisor);
    //Rotations
    for (i = 0; i <= iterator; i++){
        rotationValue = (Math.atan2(positionsArray[(i + 1) % iterator]['x'] - positionsArray[i]['x'], positionsArray[(i + 1) % iterator]['z'] - positionsArray[i]['z']))+Math.PI/2;
        rotations.push({y:rotationValue});
    }
    rotations.push({y:rotationValue});
}


function playAnimations(){
    // position animation
    if (madafakinBunnyAnimator)
        madafakinBunnyAnimator.stop();
    bunnyGroup.position.set(0, 0, 0);
    bunnyGroup.rotation.set(0, 0, 0);
    if (animateMadafakinBunny){
        madafakinBunnyAnimator = new KF.KeyFrameAnimator;
        madafakinBunnyAnimator.init({ 
            interps:
                [
                    { 
                        keys:keyArray, 
                        values:positionsArray,
                        target:bunnyGroup.position
                    },
                    { 
                        keys:keyArray, 
                        values:rotations,
                        target:bunnyGroup.rotation
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000
        });
        madafakinBunnyAnimator.start();
        
    }


}