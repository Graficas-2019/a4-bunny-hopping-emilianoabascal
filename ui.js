function initControls()
{
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    $("#durationSlider").slider({min: 10, max: 20, value: duration, step: 0.1, animate: false});
    $("#durationSlider").on("slide", function(e, u) {
            duration = u.value;
            $("#durationValue").html(duration + "s");				
        });
    $("#durationSlider").on("slidechange", function(e, u) {
            duration = u.value;
            playAnimations();
    });
    
    $("#animateMadafakinBunnyBox").click(
            function() { 
                animateMadafakinBunny = !animateMadafakinBunny;
                playAnimations();
            }
        );	
}