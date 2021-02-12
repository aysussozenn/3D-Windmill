"use strict";
var canvas;
var gl;
var eye =[0.0,0.0,6];
var at = [0.0,0.0,0.0];
var up = [0.0,1.0,0.0];
var fovy = 45;
var aspect, near=1,far=9;
var scale=1;
var pos_X=0.0,pos_Y=0.0,pos_Z=6.0;
var tar_X=0.0,tar_Y=0.0,tar_Z=0.0;
var bufferFloor,bufferHexa,bufferRect,bufferRect1,bufferRect2,bufferSt,stVertices,rectVertices,rectVertices1,rectVertices2,hexaVertices,color;
var floorVertices,translateMatrix,scaleMatrix;
var vPosition;
var r=0.0, g=0.0, b=0.0;
var transformationMatrix, transformationMatrixLoc,modelViewMatrix, modelViewMatrixLoc,projectionMatrix, projectionMatrixLoc;
var translate_x=0,translate_y=0,translate_z=0;
var rotate_X=0,rotate_Y=0,rotate_Z=0,rotX,rotY,rotZ,rotateTotal,scale_Y,scale_X;
var speed=1;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
	aspect =  canvas.width/canvas.height;
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the letters

    floorVertices = [
        vec3(   1.5,  -1.5,  1.5 ),
        vec3(  -1.5,  -1.5,  1.5 ),
        vec3(   1.5,  -1.5, -1.5 ),
        vec3(  -1.5,  -1.5, -1.5 ),
    ];
	
	
    hexaVertices = [
	//First I planned to make a cylinder and destroy the upper part by making the position 0.
	//But i couldn't so i I made a hexagonal pyramid to make the base look more round.
           		
		vec3(0.0,-1,1.0),	
        vec3(0.1,-1,1.0),
        vec3(0.05,0.3,0.95),
        vec3(0.1,-1,1.0),
        vec3(0.2,-1,0.9),
        vec3(0.05,0.3,0.95),
        vec3(0.2,-1,0.9),
        vec3(0.1,-1,0.8),
        vec3(0.05,0.3,0.95),
	    vec3(0.1,-1,0.8),	
        vec3(0.0,-1,0.8),
        vec3(0.05,0.3,0.95),
        vec3(0.0,-1,0.8),
        vec3(-0.1,-1,0.9),
        vec3(0.05,0.3,0.95),
        vec3(-0.1,-1,0.95),
        vec3(0.0,-1,1.0),
        vec3(0.05,0.3,0.95)
		
    ];
	
	stVertices = [
        vec3(   0.05,  0.2,0.94 ),
        vec3(  0.06,  0.28,0.94 ),
        vec3(  0.0,  0.2,1 )
    ];
	
	 rectVertices = [
        vec3(   0.1,  -0.2,0.9999 ),
        vec3(  0.3,  -0.2,0.9999 ),
        vec3(  0.1,  0.25,0.9999 ),
        vec3(  0.3, 0.25,0.9999)
    ];
	
	
	rectVertices1 = [
        vec3(  0.4,  -0.2,1 ),
        vec3(  0.6,  -0.2,1 ),
        vec3(  0.4,  0.2,1 ),
        vec3(  0.6,  0.2 ,1)
    ];
	
    rectVertices2 = [
        vec3(  0.7,  -0.2,1 ),
        vec3(  0.9,  -0.2,1 ),
        vec3(  0.7,  0.2,1 ),
        vec3(  0.9,  0.2,1 )
    ];
	
	bufferFloor = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferFloor );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(floorVertices), gl.STATIC_DRAW );
	
	bufferSt = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSt );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(stVertices), gl.STATIC_DRAW );
	
	bufferHexa = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferHexa );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(hexaVertices), gl.STATIC_DRAW );
	
	bufferRect = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW );
	
	bufferRect1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices1), gl.STATIC_DRAW );
	
	bufferRect2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices2), gl.STATIC_DRAW );
	
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
    color=gl.getUniformLocation(program,"color");
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix");

    document.getElementById("fovy").oninput = function(event) {
        fovy = document.getElementById("fovy").value;
    };
    document.getElementById("posX").oninput = function(event) {
        pos_X = document.getElementById("posX").value;//
    };
    document.getElementById("posY").oninput = function(event) {
        pos_Y = document.getElementById("posY").value;
    };
    document.getElementById("posZ").oninput = function(event) {
        pos_Z = document.getElementById("posZ").value;
    };
    document.getElementById("tarX").oninput = function(event) {
        tar_X = document.getElementById("tarX").value;
    };
    document.getElementById("tarY").oninput = function(event) {
        tar_Y = document.getElementById("tarY").value;
    };
    document.getElementById("tarZ").oninput = function(event) {
        tar_Z = document.getElementById("tarZ").value;
    };
    document.getElementById("inp_objX").oninput = function(event) {
        translate_x = document.getElementById("inp_objX").value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
        translate_y = document.getElementById("inp_objY").value;
    };
    document.getElementById("inp_objZ").oninput = function(event) {
        translate_z= document.getElementById("inp_objZ").value;
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
        scale=document.getElementById("inp_obj_scale").value;
    };
    document.getElementById("inp_rotation_X").oninput = function(event) {
        rotate_X=document.getElementById("inp_rotation_X").value;
    };
    document.getElementById("inp_rotation_Y").oninput = function(event) {
        rotate_Y=document.getElementById("inp_rotation_Y").value;
    };
    document.getElementById("inp_rotation_Z").oninput = function(event) {
        rotate_Z=document.getElementById("inp_rotation_Z").value;
    };
	document.getElementById("inp_wing_speed").oninput = function(event) {
	    speed = document.getElementById("inp_wing_speed").value;	
    };
    document.getElementById("redSlider").oninput = function(event) {
        r=document.getElementById("redSlider").value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        g=document.getElementById("greenSlider").value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        b=document.getElementById("blueSlider").value;
    };

    render();

};

var r_amount=0;
var amount=0.5;
var speedAmount;
function render() {
	

    gl.clear( gl.COLOR_BUFFER_BIT );
	
    transformationMatrix=mat4();
	eye = [pos_X, pos_Y, pos_Z];
    at = [tar_X, tar_Y, tar_Z];
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv(color,flatten([0.82,0.71,0.54,1]));
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferFloor );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	
	translateMatrix=translate(translate_x, translate_y,translate_z,0);
	scaleMatrix = scalem(1,1,1);
	scaleMatrix=mult(scaleMatrix,scalem(1.5,scale,scale,0));
    transformationMatrix = mult(transformationMatrix, scaleMatrix);

	rotX=rotateX(rotate_X,0,0);
	rotY=rotateY(rotate_Y,0,0);
	rotZ=rotateZ(rotate_Z,0,0);
	rotateTotal=mult(rotX,rotY);
	rotateTotal=mult(rotateTotal,rotZ);
	
	transformationMatrix=mult(translateMatrix,scaleMatrix);
	transformationMatrix = mult(transformationMatrix,rotateTotal);
	
    modelViewMatrix=lookAt(eye,at,up);
	projectionMatrix=perspective(fovy,aspect,near,far);
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	
	transformationMatrix=mult(transformationMatrix,translate(0.0,-0.5,-0.8));

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));
	gl.uniform4fv(color,flatten([r,g,b,1]));
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferHexa);
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0,18  );
	
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));
	gl.uniform4fv(color,flatten([r,g,b,1]));
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSt);
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0,3  );
	
	speedAmount= amount*speed;
	r_amount= r_amount+speedAmount;
	
	transformationMatrix=mult(transformationMatrix,translate(-0.2,0.1,0.00000001));
	transformationMatrix=mult(transformationMatrix,translate(0.2,0.125,-0.9));
	transformationMatrix=mult(transformationMatrix,rotateZ(r_amount));
	transformationMatrix=mult(transformationMatrix,translate(-0.2,-0.125,0.9));
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniform4fv(color,flatten([1,0,0,1]));
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRect);
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
	
	
	transformationMatrix=mult(transformationMatrix,translate(0.45,-0.04,0));
	transformationMatrix=mult(transformationMatrix,rotateZ(240));
	transformationMatrix=mult(transformationMatrix,translate(-0.45,0.04,0));
	transformationMatrix=mult(transformationMatrix,translate(-0.08,-0.6,0));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv(color,flatten([0,0,1,1]));
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	transformationMatrix=mult(transformationMatrix,translate(0.80,-0.19,0));
	transformationMatrix=mult(transformationMatrix,rotateZ(-240));
  	transformationMatrix=mult(transformationMatrix,rotateZ(-65));
    transformationMatrix=mult(transformationMatrix,translate(-0.80,0.19,0));
	transformationMatrix=mult(transformationMatrix,translate(0.2,0.57,0));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv(color,flatten([0,1,0,1]));
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
    window.requestAnimFrame(render);
}