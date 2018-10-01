function makeCupGame( objectsToHide, defaultScrambleAmount )
{
	var duplicate = null
	
	var correctSign = makeTextSign("Correct!")
	correctSign.material.color.setRGB(0,1,0)
	correctSign.material.transparent = true
	correctSign.material.opacity = 0
	correctSign.scale.multiplyScalar(3)
	scene.add(correctSign)
	correctSign.position.x = -0.7
	correctSign.position.y = 0.3

	var incorrectSign = makeTextSign("Incorrect!")
	incorrectSign.material.color.setRGB(1,0,0)
	incorrectSign.material.transparent = true
	incorrectSign.material.opacity = 0
	incorrectSign.scale.multiplyScalar(3)
	scene.add(incorrectSign)
	incorrectSign.position.x = -0.7
	incorrectSign.position.y = 0.3

	// var texture = new THREE.TextureLoader().load( "data/textures/wand.png" )
	var wand = new THREE.Mesh(new THREE.PlaneGeometry(1/8,1), new THREE.MeshPhongMaterial({transparent:true, depthTest:false}))
	wand.geometry.vertices[2].y = 0
	wand.geometry.vertices[3].y = 0
	wand.scale.setScalar(0.5)
    wand.objectToDuplicate = null
    wand.duplicationProgress = 0;
    var progressSpeed = 0;
    wand.unusedPosition = new THREE.Vector3(1.1,0,0)
    wand.position.copy(wand.unusedPosition)
	var duplicatingPosition = null
	scene.add(wand)

	wand.duplicateObjectAndCoveringCup = function(object)
	{
		this.objectToDuplicate = object
		duplicatingPosition = this.objectToDuplicate.position.clone()
		duplicatingPosition.x += 0.2
		duplicatingPosition.y -= 0.2

		wand.duplicationProgress = 0;
		progressSpeed = frameDelta * 2.9
	}

	wand.update = function()
	{
		var pulse = sq( Math.sin(frameCount * 0.15) )
		this.material.emissive.setRGB(pulse,pulse,0)

		if(this.objectToDuplicate !== null)
		{
			wand.duplicationProgress += progressSpeed

			if(wand.duplicationProgress < 1)
			{
				this.position.lerpVectors(this.unusedPosition,duplicatingPosition,wand.duplicationProgress)
			}
			else if(wand.duplicationProgress < 2)
			{
				this.position.copy(duplicatingPosition)
				this.rotation.z = (wand.duplicationProgress-1) * TAU/12
			}
			else if(wand.duplicationProgress < 3)
			{
				if(duplicate === null)
				{
					duplicate = this.objectToDuplicate.wandClone()
					if(duplicate.profilePicture)
					{
						duplicate.profilePicture.visible = false
					}
					console.log( duplicate.profilePicture )
                    duplicate.originalObject = this.objectToDuplicate
					scene.add(duplicate)
				}

				var placeToSitAndBeInspected = new THREE.Vector3(-0.7,0,0)
				duplicate.position.lerpVectors(wand.objectToDuplicate.position, placeToSitAndBeInspected,wand.duplicationProgress-2)
			}
			else if(wand.duplicationProgress <4)
			{
				this.position.copy(duplicatingPosition)
				this.rotation.z = TAU/12 * (1-(wand.duplicationProgress-3) )
			}
			else if(wand.duplicationProgress < 5 )
			{
				this.position.lerpVectors(duplicatingPosition,this.unusedPosition,wand.duplicationProgress-4)
			}
		}
	}
	objectsToBeUpdated.push(wand)

	var cupRadius = 0.12
	var cupInnerRadius = cupRadius * 0.86
	var cupHeight = 2 * cupRadius
	var cupRoundedness = 4;
	var radialSegments = 16;
	var cupGeometry = new THREE.CylinderGeometry( cupRadius, cupRadius, cupHeight, radialSegments)

	var indexOfVertexAtBottom = cupGeometry.vertices.length-1; //2?
	for(var i = 0; i < cupGeometry.faces.length; i++)
	{
		for(var j = 0; j < 3; j++)
		{
			if( cupGeometry.faces[i].getCorner(j) === indexOfVertexAtBottom )
			{
				cupGeometry.faces[i].set(indexOfVertexAtBottom,indexOfVertexAtBottom,indexOfVertexAtBottom)
				break;
			}
		}
	}
	cupGeometry.merge( new THREE.CylinderGeometry( cupInnerRadius, cupInnerRadius, cupHeight, radialSegments,1,true) )
	cupGeometry.merge( new THREE.RingGeometry( cupInnerRadius, cupRadius, radialSegments).applyMatrix(new THREE.Matrix4().makeRotationX(TAU/4).setPosition(new THREE.Vector3(0,-cupHeight/2,0))) )
	var cupMaterial = new THREE.MeshLambertMaterial({color:0xC0C0FF, side:THREE.DoubleSide})

	var handleThickness = cupRadius / 6
	var handleGeometry = new THREE.TorusGeometry(cupRadius/1.5,handleThickness,16,16,TAU/2)
	handleGeometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-TAU/4))
	handleGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(cupRadius-handleThickness,0,0))
	cupGeometry.merge(handleGeometry)

	var answerSelectorGeometry = new THREE.Geometry()
	answerSelectorGeometry.vertices.push(
		new THREE.Vector3(-1.5,0,0),
		new THREE.Vector3(-0.5,1,0),
		new THREE.Vector3(-0.5,-1,0))
	answerSelectorGeometry.faces.push(new THREE.Face3(0,2,1) )
	answerSelectorGeometry.merge(new THREE.PlaneGeometry(1,1))
	answerSelectorGeometry.applyMatrix(new THREE.Matrix4().makeScale(cupHeight/2,cupHeight/2,cupHeight/2) )
	function Cup()
	{
		var cup = new THREE.Mesh(cupGeometry, cupMaterial);
		cup.castShadow = true;
		cup.progressSpeed = 0;
		cup.hidingProgress = 0;
		var hideTarget = null

		var answerSelector = new THREE.Mesh(answerSelectorGeometry)
		cup.answerSelector = answerSelector
		answerSelector.onClick = function()
		{
			if( this.associatedObject === duplicate.originalObject )
			{
				correctSign.material.opacity = 1
			}
			else
			{
				incorrectSign.material.opacity = 1
			}
			duplicate.remove(duplicate.children[duplicate.children.length-1])
			//and then question restarting stuff, including removing these from the scene and nulling associated objects
		}
		clickables.push(answerSelector)

		cup.hide = function( newHideTarget )
		{
			hideTarget = newHideTarget
			this.hidingProgress = 0
			this.progressSpeed = frameDelta * 1.5
		}

		cup.reveal = function()
		{
			THREE.SceneUtils.detach(this,hideTarget,scene)
			this.progressSpeed = -frameDelta * 1.5

			scene.add(cup.answerSelector)
			cup.answerSelector.position.y = this.position.y
			cup.answerSelector.position.x = this.position.x + 0.5
			cup.answerSelector.associatedObject = hideTarget
		}

		cup.update = function()
		{
			if(hideTarget !== null)
			{
				var behindPosition = hideTarget.position.clone()
				behindPosition.z -= cupHeight

				var oldHidingProgress = this.hidingProgress
				this.hidingProgress += this.progressSpeed

				if(this.hidingProgress < 1) //go to it
				{
					this.position.lerpVectors(this.unusedPosition,behindPosition,this.hidingProgress)
					this.rotation.x = -TAU/4 * this.hidingProgress
				}
				else if(this.hidingProgress < 2) //go forward
				{
					this.position.lerpVectors(behindPosition,hideTarget.position,this.hidingProgress-1)
					this.rotation.x = -TAU/4
				}
				else if(this.hidingProgress < 3) //enclose it
				{
					var progressThroughThisPart = this.hidingProgress-2
					this.position.copy(hideTarget.position)
					this.rotation.x = -TAU/4 * (1-progressThroughThisPart)
				}
				else if(oldHidingProgress < 3) //make sure we've enclosed it
				{
					this.position.copy( hideTarget.position )
					this.rotation.x = 0;

					THREE.SceneUtils.attach(this,scene,hideTarget)

					this.hidingProgress = 3
					this.progressSpeed = 0;
				}
			}
		}
		objectsToBeUpdated.push( cup )

		scene.add( cup )
		return cup;
	}

	var cups = Array(objectsToHide.length);
	for(var i = 0; i < cups.length; i++)
	{
		cups[i] = Cup();
		cups[i].unusedPosition = new THREE.Vector3(1.2,-(i-1) * cupHeight * 1.2,0)
		cups[i].position.copy(cups[i].unusedPosition)
	}

	//"story"
	{
		
		for(var i = 0; i < objectsToHide.length; i++)
		{
			cups[i].hide(objectsToHide[i])
		}
		
		var scrambleCount = 0
		var startingSwapsPerSecond = 1.2
		var swapsPerSecond = startingSwapsPerSecond
		var originA = new THREE.Vector3()
		var originB = new THREE.Vector3()
		var objectA = null
		var objectB = null
		var swapProgress = 0

		var manager = {};
		var puzzlingStep = 0;
		var scrambleStarted = false;
        var duplicationStarted = false;
        manager.update = function()
		{
			if(puzzlingStep === 0) //moving cups
			{
				if(cups[0].hidingProgress >= 3)
				{
					scrambleCount = defaultScrambleAmount
					puzzlingStep++;
				}
			}

			if( puzzlingStep === 1 ) //duplication
			{
				if( scrambleCount === 0 )
				{
					wand.duplicateObjectAndCoveringCup( objectsToHide[0] )
					puzzlingStep++;
				}
			}

			if( puzzlingStep === 2 )
			{
				if( duplicate !== null && wand.duplicationProgress >= 4)
				{
					scrambleCount = defaultScrambleAmount
					puzzlingStep++;
				}
			}

			if( puzzlingStep === 3 )
			{
				if( scrambleCount === 0 )
				{
					for(var i = 0; i < cups.length; i++)
					{
						cups[i].reveal();
					}
					puzzlingStep++;
				}
			}

			//-----actually doing stuff
			if( scrambleCount !== 0 )
			{
				if( objectA === null )
				{
					var swap = Math.floor(Math.random() * objectsToHide.length)
					objectA = objectsToHide[swap];
					objectB = objectsToHide[(swap+1)%objectsToHide.length]

					originA.copy(objectA.position)
					originB.copy(objectB.position)
				}

				swapProgress += frameDelta * swapsPerSecond

				var pointToRotateAround = originA.clone().lerp(originB,0.5)

				objectA.position.copy(originA)
				objectA.position.sub(pointToRotateAround)
				objectA.position.applyAxisAngle(zUnit,TAU / 2 * swapProgress)
				objectA.position.add(pointToRotateAround)

				objectB.position.copy(originB)
				objectB.position.sub(pointToRotateAround)
				objectB.position.applyAxisAngle(zUnit,TAU / 2 * swapProgress)
				objectB.position.add(pointToRotateAround)

				if( swapProgress >= 1 )
				{
					objectA.position.copy(originB)
					objectB.position.copy(originA)

					objectA = null;
					objectB = null;

					swapProgress = 0;

					swapsPerSecond *= 1.5
					swapsPerSecond = clamp(swapsPerSecond,0,8)

					scrambleCount--;
					if(scrambleCount <= 0)
					{
						swapsPerSecond = startingSwapsPerSecond
					}
				}
			}
		}
	}
	objectsToBeUpdated.push(manager)
}