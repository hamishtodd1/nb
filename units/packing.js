var binColor = new THREE.Color(0.8,0.8,0.8);
var transparentMaterial = new THREE.MeshPhongMaterial({transparent:true, opacity: 0.3, color:binColor})

/*
	Chapters
		Stories
			Tell them a story about someone failing to see that they could get a few extra pacemakers in, someone dies
			Transferring bednets across africa
			"You're in charge of a team and you're going to be doing this multiple times. You can increase your pay 5%""
			Stuff about lorry
		They compete to see how many they can get in
		Same, but with rotation and a bigger container
		resize the container and more pop in
		Gotta get a certain number in. Make sure they're numbers with 3 prime factors?
		And there's a counter saying how many
		Multiple choice for how many and you can see them in there (have to count)
		Multiple choice for how many and you have to multiply them/picture it (but not rotate them)
		Same but you have to rotate them

		Pack circles into rectangle
		You're a bee and you want lots of cells
		You're evolution packing circlular eye things onto a spherical big eye
		Pack spheres into sphere (gobstopper)
		Suitcase?
		Signal processing
			Pack lines into line

	When you rotate them, they all rotate at the same time

	Applications / texture maps
		Breeze block
		Cardboard box
		pallet
		Truck https://www.turbosquid.com/3d-models/truck-games-obj/988351
		Shipping container
		Ship
		Balls - bowling, football, basketball
		Bricks
		cuboid sweeties/fig rolls in a stack, or books
		Book
		Boxes of toothepaste, tissues, bananas
		Thylakoid?
		Books, boxes with labels on the side eg computer, bananas
		Teacher can zoom, showing you can have box in box in box?

	Discs inside circle 
	Discs on sphere. Could have two stereographically projected
	Balls inside Sphere

	Old ideas/extra credit
		Spheres, can drag them around. Repulsors, why not? "How many squidgy spheres can you get in?"
		https://en.wikipedia.org/wiki/Slothouber%E2%80%93Graatsma_puzzle
		Can pack the surface of a cylinder?
		Find some "pretty" packings?
	Spheres
		Good thing that rotations wouldn't change them!
		Pack on a hyperbolic paraboloid, get seven discs around every disc
		Martin Gardner
			g12 18
			g3 7
			g14 20
			g9 3
			g7 11
		Leech lattice / e8 stuff
		Fibrations? Packing into S3 or RP3? eg making 24 cell or whatever
		There was a black and white cube thing in wikipedia

	You could use circle packing on the surface of a sphere to draw a ladybird
	They can click to add repelling dots to a bunch of other repelling dots
	You want to pack 6 circles of radius r on a sphere.
		What’s the minimum radius that sphere can have? Answer cube
		Those stone things up the road are relevant

	poster tubes
	tins of beans

	Zeimlight version
		"Where mathematics throws its hand up: cuboid packing"
		Stuff about knapsack problem
		An illustration of NP-hard stuff

	Applications
		Origami
		Oranges
		Crystals
		How gobstoppers end up in a gumball machine
		What videos can you get?

	You get them to pack in as many of the boxes as they can, see who has the most
	That gets you the rotation intuition
*/

function initPacking()
{
	{
		var packCounter = makeTextSign("")
		packCounter.stringPrecedingScore = "Boxes packed: "
		objectsToBeUpdated.push(packCounter)
		packCounter.position.x = -0.95
		packCounter.position.y = -0.95 / (16/9)
		packCounter.geometry = new THREE.OriginCorneredPlaneBufferGeometry(0.05,0.05)
		scene.add(packCounter)
	}

	{
		var applicationButton = makeTextSign( "Different object" )
		applicationButton.scale.multiplyScalar(1.6)
		applicationButton.position.y = 0.5
		clickables.push(applicationButton)

		var cuboidsToChange = []
		var applications = []
		applicationButton.onClick = function()
		{
			var newIndex = Math.floor(Math.random() * applications.length)
			//ideally you can't get the same one repeatedly
			for(var i = 0; i < cuboidsToChange.length; i++)
			{
				
			}
		}
		scene.add(applicationButton)
	}

	// initCuboidPacking(packCounter)
	initResizingRectangle(packCounter)
	return

	// initCircleInRectanglePacking()
	// initCircleOnSpherePacking()

	new THREE.OBJLoader().load("data/meshes/book.obj", function(obj)
	{
		var scaleMatrix = new THREE.Matrix4().makeScale(0.1,0.1,0.1)
		var coverGeometry = obj.children[1].geometry.applyMatrix( scaleMatrix )
		coverGeometry.computeBoundingBox()

		var pagesGeometry = obj.children[2].geometry.applyMatrix( scaleMatrix )

		var book = new THREE.Mesh(coverGeometry, new THREE.MeshPhongMaterial({color:0xFF0000}) )
		book.add( new THREE.Mesh(pagesGeometry, new THREE.MeshBasicMaterial({color:0xFFFFFF}) ) )

		scene.add(book)
	})
	
	return

	var cereal = new THREE.Group()
	scene.add(cereal)

	var names = ["front", "side", "top"]
	var addition = new THREE.Vector3(0.5,0.5,0.5)
	for(var i = 0; i < 3; i++)
	{
		var texture = new THREE.TextureLoader().load('data/textures/cereal/' + names[i] + '.jpg')
		var a = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}) )
		var b = new THREE.Mesh(new THREE.PlaneGeometry(1,1), a.material )
		a.position.setComponent((i+2)%3, 0.5)
		b.position.setComponent((i+2)%3,-0.5)

		a.position.add(addition)
		b.position.add(addition)

		if(i===1)
		{
			a.rotation.y = b.rotation.y = TAU/4
		}
		if(i===2)
		{
			a.rotation.x = b.rotation.x = TAU/4
		}
		b.rotation.y += TAU / 2
		cereal.add(a,b)
	}
	cereal.scale.set(0.228,0.414,0.072)

	var rotateButton = makeTextSign( "Rotate" )
	rotateButton.scale.multiplyScalar(1.6)
	rotateButton.position.y = -0.5
	scene.add(rotateButton)

	var rotationQueued = 0;

	clickables.push(rotateButton)
	rotateButton.onClick = function()
	{
		rotationQueued += TAU / 3
	}
	objectsToBeUpdated.push(cereal)
	cereal.update = function()
	{
		var rotationAxis = new THREE.Vector3(1,1,1).normalize()
		if(rotationQueued > 0)
		{
			var rotationAmount = 0.1
			if( rotationQueued < rotationAmount )
			{
				rotationAmount = rotationQueued
			}
			rotationQueued -= rotationAmount
			cereal.rotateOnAxis( rotationAxis, -rotationAmount )
		}
	}

	return
}

function initResizingRectangle(packCounter)
{
	// camera.position.applyAxisAngle(yUnit,TAU/8)
	// camera.rotation.y += TAU / 8
	// scene.rotation.y += TAU/8

	var dimensionsInCuboids = new THREE.Vector3(7,11,13)
	var cuboidsInside = Array(Math.round(dimensionsInCuboids.x*dimensionsInCuboids.y*dimensionsInCuboids.z) );
	var placeholderGeo = new THREE.BoxBufferGeometry(0.9,0.9,0.9).applyMatrix(new THREE.Matrix4().makeTranslation(0.5,0.5,0.5))
	placeholderGeo.computeBoundingBox()
	for(var i = 0; i < dimensionsInCuboids.x; i++) {
	for(var j = 0; j < dimensionsInCuboids.y; j++) {
	for(var k = 0; k < dimensionsInCuboids.z; k++) {
		var index = k+j*dimensionsInCuboids.z+i*dimensionsInCuboids.z*dimensionsInCuboids.y;
		cuboidsInside[index] = new THREE.Mesh(placeholderGeo,new THREE.MeshPhongMaterial({color:new THREE.Color(Math.random(),Math.random(),Math.random())}))

		cuboidsInside[index].position.set(i,j,k)
		cuboidsInside[index].position.addScaledVector(dimensionsInCuboids,-0.5)

		cuboidsInside[index].scale.setScalar(0.06)
		cuboidsInside[index].position.multiplyScalar(0.06)

		scene.add(cuboidsInside[index])
	}
	}
	}

	packCounter.update = function()
	{
		var score = 0;
		for(var i = 0; i < cuboidsInside.length; i++)
		{
			if( cuboidsInside[i].visible === true )
			{
				score++
			}
		}
		packCounter.updateText(packCounter.stringPrecedingScore + score)
	}

	var cuboidInitialDimension = 0.5
	var cuboid = new THREE.Mesh(new THREE.CubeGeometry(cuboidInitialDimension,cuboidInitialDimension,cuboidInitialDimension), transparentMaterial)
	cuboid.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.5,0,0))
	cuboid.geometry.computeBoundingBox()

	var vertexGeometry = new THREE.SphereBufferGeometry(0.03)
	var vertexMaterial = new THREE.MeshPhongMaterial({color:0xFFD700})
	function Vertex()
	{
		var vertex = new THREE.Mesh(vertexGeometry,vertexMaterial)
		scene.add(vertex)
		return vertex
	}

	var edgeMaterial = new THREE.MeshPhongMaterial({color:0x000000})
	var edgeGeometry = new THREE.CylinderBufferGeometryUncentered(0.02,1)
	function Edge(start,end)
	{
		var edge = new THREE.Mesh(edgeGeometry,edgeMaterial )
		scene.add( edge )
		return edge;
	}

	cuboid.vertices = Array(cuboid.geometry.vertices.length)
	for(var i = 0; i < cuboid.geometry.vertices.length; i++)
	{
		cuboid.vertices[i] = Vertex()
	}

	cuboid.edges = []
	for(var i = 0; i < cuboid.geometry.vertices.length; i++)
	{
		for(var j = i+1; j < cuboid.geometry.vertices.length; j++)
		{
			if(Math.abs(cuboid.geometry.vertices[i].distanceTo(cuboid.geometry.vertices[j]) - cuboidInitialDimension ) < 0.001)
			{
				var edge = Edge()
				cuboid.edges.push(edge)

				edge.start = cuboid.vertices[i].position
				edge.end = cuboid.vertices[j].position
			}
		}
	}

	cuboid.updateVerticesAndEdges = function()
	{
		cuboid.updateMatrixWorld()
		for(var i = 0; i < cuboid.geometry.vertices.length; i++)
		{
			cuboid.vertices[i].position.copy(cuboid.geometry.vertices[i])
			cuboid.localToWorld(cuboid.vertices[i].position)
		}
		for(var i = 0; i < cuboid.edges.length; i++)
		{
			cuboid.edges[i].position.copy( cuboid.edges[i].start )
			pointCylinder(cuboid.edges[i], cuboid.edges[i].end )
			cuboid.edges[i].scale.y = cuboid.edges[i].start.distanceTo(cuboid.edges[i].end)
		}
	}
	cuboid.updateVerticesAndEdges()
	scene.add(cuboid)

	var grabbedVertex = null
	var grabbingPlaneWorld = null
	var mouseIntersectionWithFacePlane = null

	objectsToBeUpdated.push(cuboid)
	cuboid.update = function()
	{
		//Can't use onclick because intersectObject doesn't always work whereas this does
		if(mouse.clicking && !mouse.oldClicking)
		{
			var localRay = mouse.rayCaster.ray.clone()
			localRay.direction.add(localRay.origin)

			cuboid.worldToLocal(localRay.origin)
			cuboid.worldToLocal(localRay.direction)

			localRay.direction.sub(localRay.origin)
			localRay.direction.normalize()

			var intersectionPoint = localRay.intersectBox( cuboid.geometry.boundingBox )
			if( intersectionPoint !== null )
			{
				grabbedVertex = cuboid.geometry.vertices[ getClosestPointToPoint(intersectionPoint,cuboid.geometry.vertices) ]
				mouseIntersectionWithFacePlane = intersectionPoint

				var closestPlaneDist = Infinity
				for(var i = 0; i < cuboid.geometry.faces.length; i++)
				{
					var face = cuboid.geometry.faces[i]
					var worldGrabbedFaceVertices = [cuboid.geometry.vertices[face.getCorner(0)].clone(),cuboid.geometry.vertices[face.getCorner(1)].clone(),cuboid.geometry.vertices[face.getCorner(2)].clone()]
					for(var j = 0; j < 3; j++)
					{
						cuboid.localToWorld( worldGrabbedFaceVertices[j] )
					}
					var facePlane = new THREE.Plane().setFromCoplanarPoints(worldGrabbedFaceVertices[0],worldGrabbedFaceVertices[1],worldGrabbedFaceVertices[2])
					if( Math.abs( facePlane.distanceToPoint(intersectionPoint) ) < Math.abs( closestPlaneDist ) )
					{
						grabbingPlaneWorld = facePlane
						closestPlaneDist = facePlane.distanceToPoint(intersectionPoint)
					}
				}
			}
		}

		//the distance that the mouseray intersection with face has moved = distance our vertex
		if( grabbedVertex )
		{
			var newMouseIntersectionWithFacePlane = mouse.rayCaster.ray.intersectPlane( grabbingPlaneWorld )
			if( newMouseIntersectionWithFacePlane === null)
			{
				//hack, projective plane alert (quite interesting)
				return
			}
			var displacement = newMouseIntersectionWithFacePlane.clone().sub(mouseIntersectionWithFacePlane)

			var oldGrabbedVertex = grabbedVertex.clone()
			grabbedVertex.add(displacement)
			for(var d = 0; d < 3; d++)
			{
				for(var i = 0; i < cuboid.geometry.vertices.length; i++)
				{
					if(cuboid.geometry.vertices[i].getComponent(d) === oldGrabbedVertex.getComponent(d) )
					{
						cuboid.geometry.vertices[i].setComponent(d,grabbedVertex.getComponent(d))
					}
				}
			}

			cuboid.geometry.verticesNeedUpdate = true
			cuboid.geometry.computeBoundingBox()
			mouseIntersectionWithFacePlane.copy(newMouseIntersectionWithFacePlane)

			for(var i = 0; i < cuboidsInside.length; i++)
			{
				cuboidsInside[i].visible = checkBoxMeshContainment(cuboid,cuboidsInside[i])
			}

			if(!mouse.clicking)
			{
				grabbedVertex = null
				grabbingPlaneWorld = null
				mouseIntersectionWithFacePlane = null
			}
		}
		cuboid.updateVerticesAndEdges()
		cuboid.updateMatrixWorld()
	}
}

function initCircleInRectanglePacking()
{
	var rect = new THREE.Mesh(new THREE.BoxGeometry(1,0.5,0.0000000001))
	scene.add(rect)

	var circle = new THREE.Mesh(new THREE.CircleBufferGeometry(0.1,32))
	scene.add(circle)
	clickables.push(circle)
	var clickedPoint = new THREE.Vector3()
	circle.onClick = function(intersectionInformation)
	{
		clickedPoint = intersectionInformation.point;
	}

	objectsToBeUpdated.push(circle)
	circle.update = function()
	{
		if( mouse.lastClickedObject === this && mouse.clicking )
		{
			var newClickedPoint = mouse.rayIntersectionWithZPlane(clickedPoint.z)
			this.position.sub(clickedPoint).add(newClickedPoint)
			clickedPoint.copy(newClickedPoint)
		}
	}
}

function initCircleOnSpherePacking()
{
	var sphereRadius = 0.4
	var sphere = new THREE.Mesh(
		new THREE.SphereBufferGeometry(sphereRadius,16,16,0),
		new THREE.MeshPhongMaterial({color:0xFF0000}))
	sphere.castShadow = true
	scene.add( sphere );
	objectsToBeUpdated.push(sphere)
	sphere.update = function()
	{
		this.rotation.y += 0.01
	}

	var spotRotations = [[1.5,0.3],[2.2,0.4],[0.8,1]];
	var spotMinRadius = 0.17;
	for(var i = 0; i < spotRotations.length; i++)
	{
		var spot = new THREE.Mesh(
			new THREE.SphereBufferGeometry(sphereRadius * 1.01,16,2,0,TAU,0,spotMinRadius*(1+i/20)),
			new THREE.MeshPhongMaterial({color:0x000000}) )
		
		spot.rotation.x = spotRotations[i][0];
		spot.rotation.z = spotRotations[i][1];
		objectsToBeUpdated.push(spot)
		spot.update = function()
		{
			this.rotation.y += 0.008
		}
		scene.add(spot);
	}
}

function initCuboidPacking(packCounter)
{
	var _scene = new THREE.Object3D();
	scene.add(_scene)
	_scene.position.z = stage.geometry.vertices[1].z * stage.scale.z;
	_scene.position.y = -9/16
	_scene.rotation.y = -TAU / 8

	var originalCuboidPosition = new THREE.Vector3(0,1/ (16/9),0)

	var orbitControls = {}
	var previousIntersection = mouse.rayIntersectionWithZPlane(0)
	objectsToBeUpdated.push(orbitControls)
	orbitControls.update = function()
	{
		if(mouse.lastClickedObject === null && mouse.clicking)
		{
			var newIntersection = mouse.rayIntersectionWithZPlane(0)

			if( previousIntersection !== null )
			{
				var displacement = newIntersection.clone().sub(previousIntersection)
				if( Math.abs( displacement.x ) > Math.abs( displacement.y ) )
				{
					_scene.rotation.y += displacement.x * 1.3;
					_scene.rotation.y = clamp(_scene.rotation.y,-TAU / 8-TAU/32,-TAU / 8+TAU/32)
				}
				// else
				// {
				// 	_scene.rotation.x -= displacement.y * 1.6;
				// 	_scene.rotation.x = clamp(_scene.rotation.x,0,TAU/16)
				// }
				camera.lookAt(zeroVector)
			}
			else
			{
				previousIntersection = new THREE.Vector3();
			}

			previousIntersection.copy(newIntersection)
		}
		else
		{
			previousIntersection = null;
		}
	}

	var cuboids = [];
	var boxGeometry = new THREE.BoxGeometry(1,1,1)
	boxGeometry.computeBoundingBox();

	var binDimensions = new THREE.Vector3().setScalar(0.4)
	binGeometry = new THREE.BoxGeometry(binDimensions.x,binDimensions.y,binDimensions.z);
	binGeometry.applyMatrix(new THREE.Matrix4().makeTranslation( binDimensions.x/2,binDimensions.y/2,binDimensions.z/2 ))
	binGeometry.computeBoundingBox();
	var bin = new THREE.Mesh( binGeometry, transparentMaterial )
	bin.position.y = 0.01
	bin.add( new THREE.Mesh( binGeometry, new THREE.MeshPhongMaterial({side:THREE.BackSide,color:binColor}) ) );
	_scene.add(bin)

	packCounter.update = function()
	{
		var score = 0;
		var thereIsALooseOne = false
		for(var i = 0; i < cuboids.length; i++)
		{
			if( checkBoxMeshContainment(cuboids[i],bin) )
			{
				score++;
			}
			else
			{
				thereIsALooseOne = true
			}
		}
		packCounter.updateText(packCounter.stringPrecedingScore + score)

		if( !thereIsALooseOne && !mouse.clicking )
		{
			var newCuboid = Cuboid(0.1,0.1,0.1)
			newCuboid.position.copy(originalCuboidPosition)
		}
	}

	var collideableCuboids = []
	var dimension = 4
	for(var i = 0; i < 3; i++)
	{
		var backgroundCuboid = new THREE.Mesh(new THREE.BoxGeometry(dimension,dimension,dimension))
		backgroundCuboid.geometry.computeBoundingBox()
		backgroundCuboid.visible = false
		backgroundCuboid.position.setComponent(i,-dimension/2)
		collideableCuboids.push(backgroundCuboid)
		_scene.add(backgroundCuboid)
	}
	
	function Cuboid(width,height,depth)
	{
		var cuboid = new THREE.Mesh(
			boxGeometry,
			new THREE.MeshPhongMaterial({color:new THREE.Color(0.5,0.5,0.5)})
		)
		cuboid.castShadow = true;
		cuboid.scale.set(width,height,depth)
		cuboids.push(cuboid);
		collideableCuboids.push(cuboid)
		_scene.add(cuboid)

		var clickedPoint = new THREE.Vector3();
		clickables.push(cuboid)
		cuboid.onClick = function(intersectionInformation)
		{
			clickedPoint = intersectionInformation.point;
		}

		objectsToBeUpdated.push(cuboid)
		cuboid.update = function()
		{
			if( mouse.clicking && mouse.lastClickedObject === this )
			{
				var newClickedPoint = mouse.rayIntersectionWithZPlane(clickedPoint.z);

				var relativeNcp = this.parent.worldToLocal(newClickedPoint.clone())
				var relativeCp = this.parent.worldToLocal(clickedPoint.clone())

				packCounter.material.map.needsUpdate = true

				var delta = relativeNcp.clone().sub(relativeCp)
				this.position.add(delta);

				var cameraPosition = this.parent.worldToLocal(camera.position.clone())
				var fullLengthToCheckAlong = 2
				var furthestPositionToCheck = relativeCp.sub(cameraPosition).setLength(fullLengthToCheckAlong).add(cameraPosition)
				var numPositionsToCheck = 80
				for(var i = 0; i < numPositionsToCheck; i++)
				{
					this.position.lerpVectors(furthestPositionToCheck,cameraPosition,i/numPositionsToCheck)
					var thisPositionRuledOut = false;
					for(var j = 0, jl = collideableCuboids.length; j < jl; j++)
					{
						if( collideableCuboids[j] !== this && checkBoxMeshOverlap(this,collideableCuboids[j]) )
						{
							thisPositionRuledOut = true;
							break;
						}
					}
					if(thisPositionRuledOut)
					{
						continue
					}
					else
					{
						break
					}
				}
				console.log(i)
				// this.position.add( rcpToCamera.multiplyScalar(Math.random() * 0.1 - 0.05) )

				clickedPoint.copy(newClickedPoint)
			}
			else
			{
				clickedPoint = null;
			}

			this.material.color.g = checkBoxMeshContainment(this,bin) ? 1:0
		}

		return cuboid
	}
}

function checkBoxMeshContainment(a,b)
{
	console.assert(a.parent === b.parent)

	var convertedBoxAMin = a.geometry.boundingBox.min.clone().multiply(a.scale).add(a.position)
	var convertedBoxAMax = a.geometry.boundingBox.max.clone().multiply(a.scale).add(a.position)
	var convertedBoxA = new THREE.Box3(convertedBoxAMin,convertedBoxAMax)

	var convertedBoxBMin = b.geometry.boundingBox.min.clone().multiply(b.scale).add(b.position)
	var convertedBoxBMax = b.geometry.boundingBox.max.clone().multiply(b.scale).add(b.position)
	var convertedBoxB = new THREE.Box3(convertedBoxBMin,convertedBoxBMax)

	return convertedBoxA.containsBox(convertedBoxB)
}

function checkBoxMeshOverlap(a,b)
{
	console.assert(a.parent === b.parent)

	var convertedBoxAMin = a.geometry.boundingBox.min.clone().multiply(a.scale).add(a.position)
	var convertedBoxAMax = a.geometry.boundingBox.max.clone().multiply(a.scale).add(a.position)
	var convertedBoxA = new THREE.Box3(convertedBoxAMin,convertedBoxAMax)

	var convertedBoxBMin = b.geometry.boundingBox.min.clone().multiply(b.scale).add(b.position)
	var convertedBoxBMax = b.geometry.boundingBox.max.clone().multiply(b.scale).add(b.position)
	var convertedBoxB = new THREE.Box3(convertedBoxBMin,convertedBoxBMax)

	return convertedBoxA.intersectsBox(convertedBoxB)
}