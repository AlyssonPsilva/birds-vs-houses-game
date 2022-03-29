//author: Jose Alysson => https://github.com/AlyssonPsilva

window.addEventListener('load', function(){
    var canvas = document.getElementById("game-screen");
    var ctx = canvas.getContext("2d");
    var collisionCanvas = document.getElementById("collision-canvas");
    var collisionCtx = collisionCanvas.getContext("2d");

    canvas.width=window.innerWidth
    canvas.height=window.innerHeight
    collisionCanvas.width=window.innerWidth
    collisionCanvas.height=window.innerHeight

    if(canvas.width<768){
        ctx.font= '0.8rem Rowdies'

    }else{
        ctx.font= '1.2rem Rowdies'

    }
    class Background{
        constructor(gamewidth, gameheight){
            this.gamewidth=gamewidth
            this.gameheight=gameheight
            this.image= document.getElementById('gamebg')
            this.x=0
            this.y=0
            this.width=gamewidth
            this.height=gameheight
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }

    let hardMode=false

    class House{
        constructor(gamewidth, gameheight){
        this.hp=2
        this.maxHp=2
        if (hardMode){
            this.hp=0
            this.maxHp=0
        }
        this.width=30
        this.height=179
        this.y=gameheight/2+60
           
        if(canvas.width<768){
            this.x=gamewidth/2+50
            
        }else if(canvas.width>=768 && canvas.width<1600){
            this.x=gamewidth/2+150

        }else if(canvas.width>=1600){
            this.x=gamewidth/2+300
            

       }
    }
    }

    let background= new Background(canvas.width, canvas.height)
    let house= new House(canvas.width, canvas.height)
    background.draw(ctx)

    window.addEventListener('resize', function(){ 
        canvas.width=window.innerWidth
        canvas.height=window.innerHeight
        collisionCanvas.width=window.innerWidth
        collisionCanvas.height=window.innerHeight
        background.width=window.innerWidth
        background.height=window.innerHeight
        house.x=canvas.width/2+200
        house.y=canvas.height/2+60
        background.draw(ctx)
        
        if(canvas.width<768){
            house.x=canvas.width/2+50

        }else if(canvas.width>=768 && canvas.width<1600){
            house.x=canvas.width/2+150
                    
        }else if(canvas.width>=1600) {
            house.x=canvas.width/2+300
       }
    })

    class Egg{
        constructor(x,y){
            this.image=document.getElementById("egg")
            this.width=30
            this.height=30
            if(canvas.width<768){
                this.width=20
                this.height=20
            }else{
                this.width=30
                this.height=30
            
            }
            this.x=x
            this.y=y
            this.speed=4
            this.deleted=false
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
        update(houseY){
            if(canvas.width<768){
                this.y+=0.4*this.speed
            }else{
                this.y+=this.speed
            }
            if(this.y > houseY) this.deleted=true
        }
    }

    class Bird{
        constructor(gamewidth, gameheight){
        this.gamewidth=gamewidth
        this.gameheight=gameheight
        this.image=document.getElementById("bird")
        if (gamewidth<768) {
            this.width=30
            this.height=30

        }else{
            this.width=81
            this.height=64

        }
        this.spriteWidth=81
        this.spriteHeight=64
        this.x=-this.width
        this.y=Math.random() * (gameheight/2 - this.height-20)
        this.imageFrame=0
        this.imageFrameTimer=0
        this.imageMaxFrames=15
        this.fps=30
        this.imageFrameInterval=1000/this.fps
        this.deleted=false
        this.dead=false
        this.randomColors=[Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)] // set three differents values to RGB colors//
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'
    }
    draw(context){
        collisionCtx.fillStyle= this.color// draw the colored Rects only in the collision canvas that is blank to make the collision system//
        collisionCtx.fillRect(this.x, this.y, this.width+10, this.height)
        context.drawImage(this.image, this.imageFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height) 
        
    }
    fly(gamewidth, gameheight, deltaTime){
        if(this.imageFrameTimer > this.imageFrameInterval){
            if(this.imageFrame >= this.imageMaxFrames){
                this.imageFrame=0

            }else{
                this.imageFrame++
                this.imageFrameTimer=0
    
            }
        }else{
            this.imageFrameTimer += deltaTime
        }
        
        if(gamewidth<768){
            this.x+= 0.3*gameSpeed
        }else{
            this.x+= gameSpeed

        }

        if (this.x > 0 + gamewidth) {
            this.deleted=true
        }


     }
    throwEgg(){
            eggs.push(new Egg(this.x, this.y))
    }
    }

    class Bat extends Bird{
        constructor(gamewidth, gameheight){
            super(gamewidth, gameheight)
            this.image=document.getElementById("bat")
            this.imageFrame=0
            this.imageMaxFrames=7
            this.spriteWidth=63
            this.spriteHeight=54
            if (gamewidth<768) {
                this.width=30
                this.height=30

            }else{
                this.width=50
                this.height=50

        }
     }
    }

    class Explosion{
        constructor(type, x,y){
        this.x=x
        this.y=y
        this.timeSinceLastFrame=0
        this.frameInterval=200
        this.deleted=false
        if(type===1){
            this.image=document.getElementById("explosion")
            this.spriteWidth=200
            this.spriteHeight=170
            if(canvas.width<768){
                this.width=30
                this.height=30
            }else{
                this.width=81
                this.height=64
            
            }
            this.frame=0
            this.maxFrame=5
            this.sound=new Audio()
            this.sound.src='./assets/sounds/boom.wav'
        }else{
            this.image=document.getElementById("eggExplosion")
            this.spriteWidth=90
            this.spriteHeight=95
            if(canvas.width<768){
                this.width=30
                this.height=30
            }else{
                this.width=81
                this.height=64
            
            }
            this.frame=0
            this.maxFrame=5
            this.sound=new Audio()
            this.sound.src='./assets/sounds/eggBlast.wav'

        }

    }
    draw(context){
        context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
    update(deltaTime){
        if(this.frame===0) this.sound.play()
        this.timeSinceLastFrame+=deltaTime
        if(this.timeSinceLastFrame> this.frameInterval){
            this.frame++
            if(this.frame>this.maxFrame) this.deleted=true

        }
        

    }
    }

    class GunShot{
        constructor(){
            this.sound= new Audio()
            this.sound.src='./assets/sounds/gunshot.wav'
            this.deleted=false
            this.sound.volume=0.8
        }
        playShot(){
            this.sound.play()
        }
    }

    class BulletHole{
        constructor(x, y){
            this.image=document.getElementById("bullethole")
            this.x=x
            this.y=y
            if(canvas.width<768){
                this.width=20
                this.height=20
            }else{
                this.width=50
                this.height=50
            
            }
            this.deleted=false
            this.timeOnScreen=1000
            this.timer=0
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
        update(deltaTime){
            if(this.timer>this.timeOnScreen){
                this.deleted=true
            }
            else{
                this.timer+=deltaTime
            }

        }
    }
    
    let birdTimer=0
    let birdInterval=800
    if(canvas.width<768){
        birdInterval=1000
    }
    let birds=[]
   
    function birdsHandler(deltaTime){
        if(birdTimer > birdInterval && birds.length <=9){
            randomizeBirds(Math.floor(Math.random() * (2 - 1 + 1) + 1))
            birdTimer=0


        }else{
            birdTimer+=deltaTime
        }
        birds.forEach((bird, i) =>{
            bird.draw(ctx)
            bird.fly(canvas.width, canvas.height, deltaTime)
            if (canvas.width<768) {
                if(bird.x>=house.x && bird.x<house.x+0.3*gameSpeed){
                bird.throwEgg()
                }

             }else{
                if(bird.x>=house.x && bird.x<house.x+gameSpeed){
                bird.throwEgg()
                }

             }                     
        })
        birds=birds.filter(bird=> !bird.deleted) //delete birds off the screen of the array//
    }

    function randomizeBirds(number){
        if(number===1){
            birds.push(new Bird(canvas.width, canvas.height))
        }else if(number===2){
            birds.push(new Bat(canvas.width, canvas.height))

        }
    }
    
    let explosions=[]
    let eggs=[]

    function eggsHandler(){
        eggs.forEach(egg=>{
            egg.draw(ctx)
            egg.update(house.y)
            if(egg.y>=house.y && egg.y<house.y+egg.speed){
                explosions.push(new Explosion(2, egg.x, egg.y-egg.height))
                egg.deleted=true
                house.hp--
                
            }

        })
        eggs=eggs.filter(egg=> !egg.deleted)
    }

    let gunShots=[]

    function killBird(deltaTime){
        gunShots.forEach(gunShot=>{
            gunShot.playShot()
            gunShot.deleted=true
        })
        explosions.forEach(explosion=>{
            explosion.draw(ctx)
            explosion.update(deltaTime)
            
        })
        explosions=explosions.filter(explosion=> !explosion.deleted)
        gunShots=gunShots.filter(gunShot=> !gunShot.deleted)  
    }

     let bulletHoles=[]

    function bulletHolesHandler(deltaTime){
         bulletHoles.forEach(bulletHole=>{
            bulletHole.draw(ctx)
            bulletHole.update(deltaTime)
        })
         bulletHoles=bulletHoles.filter(bulletHole=> !bulletHole.deleted)
    }

    function handleGameOver(){
         if(house.hp<0){
             gameOver=true
             gameStateHandler(12)
         }
    }

    let score=0

    function drawHud(){
        ctx.fillStyle='#2b0504'
        ctx.fillText('SCORE: ' + score, canvas.width/2-100, 30)
        ctx.drawImage(document.getElementById("heart"), canvas.width/2+50, 15, 20, 20)
        ctx.fillText(' : '+house.hp, canvas.width/2+70, 30)
        
         window.addEventListener('resize', function(){
            if(canvas.width<768){
                ctx.font= '0.8rem Rowdies'

            }
            else{
                ctx.font= '1.2rem Rowdies'

            }
         })
        
    }

    let shotsOffTarget=0
    let shotsInTarget=0
    let playerTotalShots=0
    let playerAccuracy=0

    window.addEventListener("click", (e)=>{
    const detectedColor= collisionCtx.getImageData(e.x, e.y, 1, 1)
    const pc= detectedColor.data
    birds.forEach(bird=>{
        if(bird.randomColors[0]===pc[0] && bird.randomColors[1]===pc[1] && bird.randomColors[2]===pc[2]){
            bird.deleted=true
            score++
            shotsInTarget++
            explosions.push(new Explosion(1,bird.x, bird.y))
            gunShots.push(new GunShot())
        }
        })
        if(!pause && pc[0]===0 && pc[1]===0 && pc[2]===0){
            gunShots.push(new GunShot())
            if(canvas.width<768) {
                bulletHoles.push(new BulletHole(e.x-10, e.y-10))
                shotsOffTarget++
            }else{
                bulletHoles.push(new BulletHole(e.x-23, e.y-23))
                shotsOffTarget++
            }
            

        }
    })

    let lastTime=0
    let pause=false
    let gameOver=false

    function animate(timeStamp){
        collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
        let deltaTime= timeStamp - lastTime
        lastTime=timeStamp
        updateGameSpeed(deltaTime)
        background.draw(ctx)
        bulletHolesHandler(deltaTime)
        birdsHandler(deltaTime)
        killBird(deltaTime)
        drawHud()
        eggsHandler()
        handleGameOver()
        if (!pause && !gameOver) {
            requestAnimationFrame(animate)
        }

    }
    class GameMusic{
        constructor(){
            this.menu= new Audio('./assets/music/menu.wav')
            this.stage1= new Audio('./assets/music/stage1.wav')
            this.stage2= new Audio('./assets/music/stage2.wav')
            this.stage3= new Audio('./assets/music/stage3.wav')
            this.gameOver= new Audio('./assets/music/gameover.wav')
            this.currentMusic= new Audio('./assets/music/silence.mp3')
        }
        playMenu(){
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic=this.menu
            this.currentMusic.loop=true
            this.currentMusic.play()


        }
        playStage(stage){
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            switch(stage){
                case 1:
                this.currentMusic=this.stage1
                break;

                case 2:
                this.currentMusic=this.stage2
                break;

                case 3:
                this.currentMusic=this.stage3
            }
            this.currentMusic.loop=true
            this.currentMusic.play()
        }
       
        playGameOver(){
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic=this.gameOver
            this.currentMusic.play()
        }
    }
    const music= new GameMusic()

    let gameSpeed=1
    let gameSpeedInterval=10000
    let gameSpeedTimer=0
    let currentStage=1

    function updateGameSpeed(deltaTime){ 
        if(gameSpeedTimer> gameSpeedInterval){
            gameSpeed+=1
            gameSpeedTimer=0
            if(gameSpeed===5){
             music.playStage(2)
             currentStage=2
         }
            else if(gameSpeed===10){
                music.playStage(3)
                currentStage=3
            }

        }else{
            gameSpeedTimer+=deltaTime
        }

    }

    function calculatePlayerStatistics(){
        playerTotalShots= shotsInTarget+shotsOffTarget
        playerAccuracy=Math.round(((shotsInTarget*1)/playerTotalShots)*100)
    }
    function printPlayerStatistics(){
        const scoreStatisticText=document.getElementsByClassName("score-text")
        const shotsStatisticText=document.getElementsByClassName("shots-text")
        const accuracyStatisticText=document.getElementsByClassName("accuracy-text")

        scoreStatisticText[0].innerText= "Your score is: " +score +" points"
        shotsStatisticText[0].innerText= "You gave: " +playerTotalShots+ " shots"
        accuracyStatisticText[0].innerText= "Your accuracy is : " +playerAccuracy+ "%"

    }


   function generatePlayerStatistics(){
        calculatePlayerStatistics()
        printPlayerStatistics()
   }

   function resetGameVariables(){
        pause=false
        gameOver=false
        gameSpeed=1
        score=0
        house.hp=2
        birds=[]
        explosions=[]
        gunShots=[]
        eggs=[]
        bulletHoles=[]
        shotsInTarget=0
        shotsOffTarget=0
        playerTotalShots=0
   }

    const gameMenu= document.getElementsByClassName("game-menu")
    const homeMenu= document.getElementsByClassName("home")
    const menuPause= document.getElementsByClassName("pause")
    const gameOverMenu=document.getElementsByClassName("game-over")
    const statisticsMenu= document.getElementsByClassName("statistics")
    const gameCredits= document.getElementsByClassName("credits-div")

    let menuBtns= document.querySelectorAll(".menu-button")

    menuBtns.forEach((btn, i)=>{
    btn.addEventListener("click", ()=>{
        gameStateHandler(i)
    })
   })

    function gameStateHandler(btn){

        switch(btn){
            case 0:  //on press pause button//
            music.playMenu()
            pause=true
            hideHomeMenu()
            showGameMenu()
            showPauseMenu()
            hidePauseButton()
            canvas.classList.remove("playing")
            break;

            case 1: //on press play button of the main menu//
            resetGameVariables()
            music.playStage(1)
            hardMode=false
            shotsOffTarget--
            canvas.classList.add("playing")
            hideGameMenu()
            showPauseButton()
            animate(0)
            break;

            case 2: //on press play hard mode of the main menu//
            resetGameVariables()
            music.playStage(2)
            hardMode=true
            gameSpeed=5
            house.hp=0
            shotsOffTarget--
            canvas.classList.add("playing")
            hideGameMenu()
            showPauseButton()
            animate(0)
            break;

            case 3:// on press show credits of home menu//
            hideHomeMenu()
            showGameCredits()
            break;

            case 4:  //on press back button of pause menu//
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background.draw(ctx)
            hidePauseMenu()
            canvas.classList.remove("playing")
            showGameMenu()
            showHomeMenu()
            break;
            
            case 5: //on press continue button of pause menu//
            music.playStage(currentStage)
            pause= false
            shotsOffTarget--
            canvas.classList.add("playing")
            hideGameMenu()
            hidePauseMenu()
            showPauseButton()
            animate(0)
            break;

            case 6:// on press of show statistics button of pause menu//
            hidePauseMenu()
            hideHomeMenu()
            showStatisticsMenu()
            generatePlayerStatistics()
            break;

            case 7:// on press back button of statistics menu//
            statisticsMenu[0].classList.add("disabled")
            if (gameOver) {
                 showGameOverMenu()
                
            }else{
                showPauseMenu()
            }
            break;

            case 8:  //on press back button of game over menu//
            music.playMenu()
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background.draw(ctx)
            hidePauseMenu()
            hideGameOverMenu()
            canvas.classList.remove("playing")
            showGameMenu()
            showHomeMenu()
            break;

            case 9: // on press try again button//
            resetGameVariables()
            music.playStage(1)
            if (hardMode) {
                music.playStage(2)
                gameSpeed=5
                house.hp=0
            }
            shotsOffTarget--
            hideGameMenu()
            canvas.classList.add("playing")
            hideGameOverMenu()
            showPauseButton()
            animate(0)
            break;

            case 10:// on press of show statistics button of gameover menu//
            hidePauseMenu()
            hideHomeMenu()
            hideGameOverMenu()
            showStatisticsMenu()
            generatePlayerStatistics()
            break;

            case 11: // on press back button of game credits//
            hideGameCredits()
            showHomeMenu()
            break;

            case 12: // on Game Over//
            music.playGameOver()
            hideHomeMenu()
            hidePauseButton()
            hidePauseMenu()
            showGameMenu()
            showGameOverMenu()
            canvas.classList.remove("playing")
            break;
        }

    }

    function showPauseMenu() {
        menuPause[0].classList.remove("disabled")
    }

    function hidePauseMenu(){
        menuPause[0].classList.add("disabled")
      
    }

    function showPauseButton(){
        menuBtns[0].classList.remove("disabled")

    }

    function hidePauseButton(){
        menuBtns[0].classList.add("disabled")

    }

    function showGameMenu(){
        gameMenu[0].classList.remove("disabled")
    }

    function hideGameMenu(){
        gameMenu[0].classList.add("disabled")
    }

    function showHomeMenu(){
        homeMenu[0].classList.remove("disabled")
    }

    function hideHomeMenu() {
        homeMenu[0].classList.add("disabled")
    }

    function showStatisticsMenu(){
        statisticsMenu[0].classList.remove("disabled")
    }

    function hideStatisticsMenu(){
        statisticsMenu[0].classList.add("disabled")
    }

    function showGameOverMenu(){
        gameOverMenu[0].classList.remove("disabled")
    }

    function hideGameOverMenu(){
        gameOverMenu[0].classList.add("disabled")
    }

    function showGameCredits(){
        gameCredits[0].classList.remove("disabled")
    }
    
    function hideGameCredits(){
        gameCredits[0].classList.add("disabled")
    }

}) 