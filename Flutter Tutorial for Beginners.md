# 1 - Flutter Tutorial for Beginners Intro & Setup
    hey gang and welcome to your first step to becoming a flutter ninja alright then gang so first things first what is flutter exactly well flutter is a mobile UI framework and we use it to create native apps for iOS and Android devices now those apps that would create they're all going to get access to platform AP is like the camera or the microphone and the great thing is is that when we use flutter to create these apps we only have to use a single code base and then those apps they're going to run on both of these different operating systems iOS and Android now that single codebase that we use and creates that is created using a programming language called dart and we're going to learn all about darts later on in the course now there's loads and loads of different benefits to using flutter to create native apps but I'm just going to run through a few of them right here so first of all like you've already said we only use one code base using that darts programming language and this is really good because then we don't have to write a separate code base for iOS and a separate code base for Android then when we come to update something we don't have to update it twice just once just one single code base so that's awesome secondly we can use a good layout methodology when we use flutter board right from responsive web so you're gonna find it really easy to make clean and responsive apps that are going to suit many different device sizes so that is awesome we're also going to get a very smooth and a quick experience when we're running these apps and it also works really well with firebase as a back-end which as a firebase fanboy is a Bruce Lee bonus for me because I absolutely love implementing firebase into a lot of my different websites or apps it also uses dart like I've already said which is a really easy language to pick up if you already know the basic principles of another programming language and we're going to see that later on in the course it uses material design out with the box so your apps are going to look awesome without you even trying to make them look good and finally there's some great docs and guides on the flutter website as well so if you do ever get stuck just check out the website it's gonna be really really helpful to you southern my friends this series is going to essentially be split up into two different halves in the first half we're going to learn all about the basics of flutter and we're going to also create a couple of really simple dummy apps and then in the second half of the series we're going to put everything together that we've learned plus a few extra pieces and we're going to create an app which looks something like this it's an app which tells you the time in different locations or different cities around the world so right now in New York apparently it's 157 p.m. but we can change the location I could go to somewhere like Nairobi obviously is 1257 in London it's 10:57 and if we go somewhere like Seoul then in 657 and it's also night so we get a night picture in the background as well so this is ultimately what we're going to be creating in this course now before you go any further I do want to make one thing crystal clear this course is for developers who are completely new to flutter altered arts but not completely new to programming in general and would recommend strongly that first you have at least a basic understanding of another programming language before you start here or at least a good grasp of programming principles in general now in flauta we use a language called dart which is pretty easy to pick up if you already know another programming language whether that be JavaScript or Python or something else to the points where you understand what classes are what functions are variables asynchronous code api's and all the building blocks of programming in general because dart uses much of the same building blocks so if you are comfortable with another language or programming in general then you should be fine picking up darts as we go along and I will give you a very quick primer before we start to and we'll pick up the rest as we go forward however if you're completely new to programming in general then this is not the best place to start your learning path I would advise you to start by learning the basics of programming first then come back here to tackle flutter now if you want to learn another programming language first you could either learn dart which is what we'll be using in this course by going to the docs online or even checking out tutorials for doubts or if you want to check out something else I have playlists for modern JavaScript on this channel and also Python as well so I'll leave those links down below so you could check out the basics of those first then return here now for the rest of us let's get cracking with this course so to create these flutter apps I'm going to be using android studio and the reason I'm doing this is because we can install a couple of nice packages which are really going to help us when we're creating apps with flutter now you don't have to use Android studio you can use your own preferred text editor like vs code or something else the choice is entirely yours but if you want to follow along exactly as I'm doing I would advise you strongly to download Android studio right here you can get it from this address developer.android.com forward slash studio and it will leave all of these links down below by the way okay then so next we need to install git now git is a version control system and we use it for tracking changes to our code you do not necessarily mean to know how to use git for this course it's always good to know but it's not essential for this course we just need it on our computer because flutter depends on it and we'll use it to install flutter so make sure you go to this address git - SCM comm forward slash downloads and download it for your operating system make sure you download this and install it before you go to the next step which is to install flutter so if you go to flutter dev forward slash Docs forward slash get started forward slash install again all these links down below you can choose your operating system I'm on windows and then it's going to give me a guide on how to install this so first of all the system requirements and you can see down here get for Windows is a requirement which is why we just installed it and if we scroll down a bit we can see down here get the flutter SDK this is how we install flutter onto the computer so what we're going to be doing is using git to clone a repository onto our computer what that means is basically getting a load of code from the fluttered github and then putting it on our computer that's essentially installing flutter to our computer what it does say is that we don't want to clone this into any kind of directory that requires elevated privileges like Program Files instead just do it directly into the C Drive in some kind of folded like source now I've already gone into my C Drive right here and created this folder that is where I am going to clone the github repo to so all we need to do is copy this dude and then we're going to use CMD or command prompt to install this so the first thing we need to do is navigate into this source folder right here because this is where we're going to install flutter so I need to get to my C Drive then inside the source folder currently I mean C uses Shawn so I need to see D up a couple of levels so C D dot that means change directory then change directory space and then go into the source folder so this is where we want to install flutter now I'm just gonna paste in that line we copied from this website over here and press Enter that is going to clone that github repository from flutter to our computer okay so once that's installed we can open up this flutter folder inside the source folder and now if we go down to the flutter console if we run this we're going to get this flutter console right here so what we can essentially do now is run flutter commands inside this console and what I'm going to do is say flutter dr. and this basically runs a little diagnostic for us on flutter and make sure it's installed correctly I suppose now when you first run this it's going to take a couple of minutes and that's because it's checking the dart SDK version or rather downloading SDK and it's just going to take a couple of minutes before it gives you some feedback all right and so once that's all complete hopefully at the top you're going to get a green tick to say flutter is installed and we have a version number right there and also Android studio if you've installed that as well so hopefully those are green ticks it doesn't matter so much if these are not green ticks at the bottom we know now we have flutter installed on our computer now at the minute flutter can be wrong inside this flutter console but it might be that if you try to run floor to elsewhere on your computer it doesn't work for example if we open up another command prompt and press Enter if you try to write flutter right here and then say for example the version so Double Dash and then version this might work for you it might not work if it does work then you don't need to do anything else if it doesn't work then you're gonna need to edit the path of variable on your environment variables so that you can use flutter elsewhere on your computer you can see right here this worked because it told me what version of flutter I have installed but if it doesn't then just go down here it's likely an E and V and then click Edit the system environment variables and then go to environment variables right here and you want to double click this password so inside here you can see I've got this one which is sea source flutter and bin so that needs to be there in order for us to use flutter elsewhere on the computer and that's why it's worked for me over here in the command prompt if it didn't work for you then just click on new right here and then inside this space just type in C then the colon and then the backslash source backslash flutter backslash bin or whatever directory you installed it to okay so once you've done that click OK to add that and then we're going to cross all this off I want you to close your command prompt and then try this again flutter space double dash version then it should work so now we have flutter installed on our computer the final thing I want to show you in this video is how to get all of the course files for this course because I've done closed files for every single lesson so they're all in github and you want to go to this address right here this link is going to be down below and the repo is called flutter beginners tutorial so the way I've done this is that every lesson that requires code in this course has its own branch on this repo so you might get here look at this and say well there's no code in this repo but if you click on this branch then you're going to see all of these different lessons right here so if you wanted to see the code for lesson 20 then you click a little less than 20 branch and you can go into the folder to see the code for this lesson now if you prefer you can just browse it this way or because we now have git installed we can use git to clone this repo on to our computer and we can do that by going to clone our download and clicking this button right here to copy the address of this repo then you just do git clone and then this repo in whatever directory you want if you prefer just to download a zip folder of each different branch you can do just click on download zip right there okay so there we've got my friends that is your introductory video I really do hope you enjoy this course and if you do like the videos please my friends don't forget to share subscribe and like and I'm gonna see you in the very next one where I'll explain exactly how flutter works [Music]

# 2 - Flutter Tutorial for Beginners Flutter Overview
    alright then gang so if there's one concept I want you to fully understand by the end of this video it's gonna be widgets widgets are the bedrock of flutter applications because without them we can't create them everything inside a flutter app is essentially a widget so imagine we create a very very very very simple flutter application and it looks something like this inside the phone and everything inside here would be a widget okay so we have all these different pieces of contents but surrounding them all first of all would be what's known as a root widget so that surrounds everything in the entire app then nested inside that widget we have this app bar widget at the top this strip and inside that we have nested a text widget which is the actual title of the app so we can see this up kind of taking shape in this tree like structure of widgets well we have one widget nested inside another and one widget nested inside this one etc now also on the page we have this content down here and surrounding that could be some kind of container widget and then inside the container widget would be a text widget so we can see now this tree is taking shape and not many applications that you create using flutter are going to be this simple and just contain a handful of widgets like this but you can see this general idea of what's known as a widget tree in flutter so a widget tree just describes the structure of widgets inside your app now there's loads and loads of different kinds of widgets pre-built into the flutter framework that we can use out-of-the-box so things like a text widget or a button widget to create buttons a real widget which is to do with the layout of different widgets in a row likewise we have a column widget for laying out different widgets in a column and also image widgets plus loads loads loads more which we're going to see as we go through the course now each of these widgets are also fully customizable and we can pass through different properties to these widgets to alter how they display on the screen so for example our text widget could have a style property which would then determine how it looks the font weight things like that we also have a text align property and overflow property max lines etc now a bottom widget could have a color property to define the color of the button an elevation property to say whether it should be elevated off the screen or not and by how much are disabled color property which is going to determine how it looks when the button is disabled and enabled property to say whether it is enabled or not etc so all of these different flutter widgets they contain all those are different properties that we can define values for which is going to determine how they actually look and behave on the screen now at the end of the day all widgets are in flutter are classes each widget has its own programmatic class which defines its behavior and also how it looks on the screen now the way we implement this kind of widget tree structure in flutter is by using a programming language called dart now that is a language developed by Google to build mobile desktop and web applications really easy to pick up it's similar to other object-oriented programming languages it uses classes functions types etc and I will explain it as we start to write it in our code but for those of you who want a sneak preview of how doubt looks to create a flutter app here we go this is just from my github repo I've gone to the last lesson and just chosen a random dart file to show you we can see right here this is a class called home state and this is all of which is at the end of the day a class in dart and down here we're using these different widgets to create our widget tree so everything in blue down here this is essentially a widget and you can see that they're nested inside each other and it's these different widgets with their different properties that are making up our widget tree inside flutter so we're going to learn all about this as we go through the rest of the course but to begin with what I'd like to do is just bring you up to speed with dart in itself I'm going to teach you all of the basics so that for the rest of the videos you can kind of pick it up as we go along

# 3 - New Flutter Masterclass Course!
    all right then gang so it's been a long long time in the Makin but it's finally here the flutter masterclass course which have spent about the last 10 weeks making and then remaking and adding more and more content to it but it's here at last and it's just been released on the net Ninja Pro website so you can buy it now for just $10 however I'm offering it for just $5 to the first 1,000 people that grab it using the promo code flutter ninja 50 and that's all in caps so make sure you snap it up quickly if you want get it at that discounted price I'm going to leave the link to this course page down below the video or if you want to sign up for net Ninja Pro and get instant access to this masterclass as well as all of my other masterclass courses Pro exclusive courses and also the entire crash course Library as well then you can do for just $9 a month and you can get your first month half price if you use this promo code right here so I'm going to leave the link to this page down below the video as well anyway this new flutter masterclass course is packed full of content you're going to learn all the basics about widgets States and layouts in flutter you'll learn how to make custom themes for your flutter applications how to navigate between different screens by using the flutter Navigator how to manage Global State using the provider package you're going to see how to integrate a flutter application with a database to persist data we'll make data models using classes and mixins and finally you're going to learn how to make animations using build in widget as well as with an animation controller for more fine control and along the way you're going to make two completely different applications to learn all of this stuff including one that looks a little bit like this which is a character creation application for some kind of I don't know futuristic RPG or something so yeah there's absolutely loads and loads of content in this course about 14 hours worth in total I actually finished the course about four times and each time I did I decided to add just one more extra chapter and eventually I just had to stop otherwise I'd never get it released so anyway if you want to become a flutter ninja then definitely go and get this course like I said the link is down below and if you're one of the first 1,000 people to use that promo code flutter ninja 50 then you'll get it for half price so I really really hope you enjoy watching it I've Loved making it and I'm really stoked I can finally share it with you all also I will be releasing the first chapter for free very soon on the YouTube channel as a bit of a crash course preview so stay tuned for that one please don't forget to leave your comments down below and like the video that really helps a lot and hopefully I'll see you all on the full course [Music] see a

# 4 - Flutter Tutorial for Beginners Dart Primer
    okay they're my friends so you should already know this by now because I've said it more times than I can count but I'll say once more for good measure flutter uses darts as the programming language to create apps now if you're familiar with other languages like JavaScript for example you'll have no problem picking up darts it's going to use a lot of the same concepts but the syntax is slightly different so I'm assuming the by now you're already familiar with the basic concepts and building blocks of another programming language like JavaScript or Python or something else if you have absolutely no experience with any other programming language then you probably won't follow along as well with this course because I'm not going to be going into too much detail about dart and programming concepts in general I'm just gonna be showing you the things we'll most commonly be using in flutter so that you're a little familiar with them when we begin so in this lesson I just want to give you a quick primer to the language nothing too deep and then we're going to pick up all of the rest as we go along so to do this I want you to head over to dart spot which you can find at dartpad dot dot lang now when you get there you're gonna see something like this and this is basically a playground for us to test out some darts code so on the Left we can write our code and we can see these dummy code waiting for us already and on the right we have the console which is where we're going to print out some results so if I press run now it's gonna run this code and you're gonna see this stuff right here where it's printing stuff out in the console so let me run that and we can see hello five times so let me first get rid of all this junk over here I'm gonna keep this function right here void main because it expects this function right here this is what it's called when we click on run and if I now just print something like Hello and put a semicolon at the end then run it then we can see hopefully just hello once okay so this is the code which is going to run when we click on the run over here so I'm going to now delete of that thing right there and the first thing I want to talk about is variables so dart use these variables what like any other programming language would use variables we can store values inside variables and then we can use those values at a later point in time now doubt is also what's known as a statically typed programming language and what that basically means is that once we declare a variable and we give that variable a type for example a string we then can't change the type of that variable in the future so if I was to create a string variable called name and set that value equal to short then I then can't change the value of that variable to something like 30 an integer in the future we can't do that in dart because it's a statically typed programming language so let's do a few different examples of variables the first one I'm going to do is going to be an integer now the way we do this to create a variable is by first declaring the type which is going to be int in my case then the variable name which I'm going to call age and then we set that equal to a value and we finish off a statement in dart with a semicolon much like in JavaScript so now we have this age which is an integer and it's equal to 30 if we wanted to see in the console we just use the print function and then we'd say what we want to print which is age so now if I run this then hopefully we should see that age over here in the console which we do cool so let's do another example I'm going to say this time string so I'm declaring a string variable now and saying the name is equal to shortly and now I'm going to output the name like so if I press run then we should see that name now what happens when we try to change the type of this so like I said we've declared a string and we can't change that now Eve i under here tried to say name is now equal to 30 then this is not going to work because we're trying to change the type of this and we get an error it says a value of type int can't be assigned to a variable of type string so we can't do this but what we can do is overwrite this a value with a different string so I could say now that this is can instead and if I run this then it's going to work and it's going to output can instead of Chorley now another type of variable we can do is a boolean and we do that by saying bool and we'll give this some kind of variable name like is night I'm going to set this equal to false because it's not night where I am at minute and then if we try to print this I'm going to say is night like so and run this then we should see hopefully false there we go so we've seen these different types of variables inside darts but that also comes with a different data type called dynamic and this dynamic type emulates the behavior of a variable in a dynamic language for example JavaScript so if we say the type is dynamic it means we can change that type in the future now that does negate the benefit of using a statically typed language and it may lead to more errors in your code later on if you accidentally switched types so I'm going to be avoiding using the dynamic variables where possible and instead you're going to see me more often than not declare the type of variable first but I will give you a quick example right now so I'm gonna say dynamic and then say like name is equal to chun-li and I'm gonna print this first of all I'm going to say print name and then run it and hopefully we should see chun-li but then if I try to say name is now equal to 30 which is an integer and I try to run this then it is going to allow me to do that it's going to allow me to change this because it's a dynamic type but like I said that negates the benefits of a statically typed language and you won't see me do this very often only when I need to do it ok so the next thing I'd like to talk about is functions and again they also use these functions much like any other programming language would use functions in there and we can see an example of a function or right here where it says void main and then the curly braces so this main function this is a top-level required function in dart it's the function that doubt will automatically find and execute when we run a dart file and you're going to see this later on in flutter as well now we have the function name here which is main then we have the parentheses and then the curly braces and any code that you want to execute when this function runs goes inside this code block inside the parentheses so you know I could print you know something right here and obviously because dart is going to look for this main function and run it when it starts it's going to run the code inside that print something now we also see this keyword at the start called void and you'll see this quite often in doubt or another type in front of functions when they declared it basically says what the function is expected to return now a function with this void keyword in front of it means that it's not going to return anything and if we try to return something here like return you know a string called hello then it's gonna probably error so if I try to run it now you see here the return type string isn't avoid as defined by the method main so we're saying here we don't want this function to return anything so if I try to return something it's gonna error and not let me do that but we can't return values from functions we just have to declare what we're returning from the function when we write it so for example I could say we're gonna return a string from this function and this function is going to be called greeting so we'll give it a name of greeting and inside the curly braces what I'm gonna do is just return a string which is hello okay so what I could do now is I could say okay I'm going to create a variable up here now this variable is going to be a string and I'm gonna call it greet and I'm gonna set it equal to greeting like so so when we run this function it's returning this value which is a string and we're storing that in this variable now this has to match up with what this is because it's expecting us to return a string so we couldn't say int right here because we're not storing an integer we're storing a string and it's going to error if we try to do that so this has to match up with whatever we are actually returning from the function like goodness I can't write string properly all right there we go string greet equal to greet.tolowercase I don't know gets age and then inside the function I'm just going to return 30 like so and then I could say int age is equal to get age like so and I'm also going to print these two things I'm going to print out the age and I'm also gonna print out greet so let me save this hopefully we should see both of these things over here now there we go we get something first of all because we print it right here then we get 30 then hello so this all works and this is how we return different types inside functions and remember when we say void it means we're not returning anything inside that function now data also supports the use of arrow functions similar to how Java Script uses arrow functions and basically we can use these if the return fits onto one line so as long as we've got a load of different logic right here and by the way this is how we do a comment in tark double dash as long as we don't have a load of logic and then we return something if we're just returning on one line then we can convert this to an arrow function so what we can do is get rid of the curly braces first of all right here then we can get rid of return we don't need that bring this up to the next line and then just do an arrow after this and this is doing exactly the same thing so we have the function name with the parentheses and arrow and then what we return from this function so if I was to run this now then everything should still work the same way I'll do the same way the get age so let me delete the parentheses the curly braces rather and the return statement and pop an arrow right there and if we run this it should work exactly the same there we go okay so this is just a nice way to create functions if they're just returning a single value and that my friends is the basics of functions in Dart now I'd like to also show you a different type in dart and that type is called a list so a list in dart is a bit like an array in JavaScript we use the same square bracket notation to store a list of different values so I'm going to create a list called names now we declare the type of this variable first of all so the type is a list and then the variable name which is going to be called names and we set it equal to a list now I said that we use the same square bracket notation which we are doing right here and then we can just place different values inside this list so I'm gonna say Shawn Lee and then I'll do Yoshi and then I'll do Mario so I can now underneath print these names by saying print and their names and I'm going to run this over here and hopefully we'll see these names in the console which we can okay so I spoke this completely wrong it's not Mario it's Miriam for some reason so Mario and what we could do is now add to this list and also remove items from this list by using a couple of different methods and remember methods are just functions so I could say now names dots add it's add something to this list so the thing I'm gonna add is going to be a new name Luigi and then again we're printing the names down here so we declare names originally and we need to update that to be named not name then we add a new name to it and then we're printing the names so if we run this now we should see this with Luigi added as well which we do now we can also remove them by using the remove method so I'm gonna say names don't remove and then I'll remove Yoshi like so whoops in quotations so Yoshi and we'll run this and now we see this list without Yoshi but it still has Norwegian because we added that now at the minute we could add in any data type to this list because we've not said what kind of data is going inside this list we've just said that this is a list so if I wanted to I could say names add and then I could add an integer for example 30 and if I run this it's not going to error it's going to let me do this but this is not typically good practice to mix our different data types inside a list so it's common practice and good practice to put what type of data you expect to be inside this list after we say that it's a list and the way we do this is by using angle brackets so we do our angle brackets like that and then we put in here the type that we expect the data to be inside this list so I could say string like so and now it will only let us add strings to this list and if it finds an integer in it it's going to error we can see right here the argument type int can't be assigned to the parameter type string so it's not letting me do this now likewise if I try to add it up here 30 it's not going to let me do that either because now we're just expecting a list of strings if I change this to int then it's just going to be a list of integers and now we can't add the strings so that's good practice to say what type of data are going to be inside these lists and we're going to be using lists quite frequently as we go forward especially when we're creating real flutter apps to store local data in so we will see them quite a lot as we go forward so the final thing I'd like to talk about in this primer is classes in doubt so let me just get rid of all of this junk first of all so then class is in pretty much any programming language like a blueprint for an object so that object could be something like a user object and we could store information about that user on that user object like a user name a biography and age etc or it could be something like a shopping cart object with information about what's in a shopping cart like the items the total number of items the price of the items etc so we have this idea of a class which is like a blueprint for objects and we use classes to describe these objects by giving them properties and the methods and methods are just functions so let's start by creating a simple class I'm going to call this class user so the way we create a class is by using the class keyword first of all then I'm going to say user convention is that we use an upper case first letter and then in hand side our curly braces we're going to define the different properties and methods of this user so I'm going to create two properties I'm going to say a user name and an H now the user name is going to be a string so user name is going to be equal to Mario we'll say and then we'll also do an integer which is the age and set that equal to 25 okay so we have these two properties defined on this user class now which is described a user object so under here what we can also do is create a method or a function associated with user objects so I'm going to create a function it doesn't return anything so it will be a void function and it's called logging an inside here all we're gonna do is print out something like user or logged in like so okay then so we have this user class right here and it describes our user object it says it's got two properties and also this method this login function now this is not actually creating any kind of user object in itself this is just the class the blueprint the thing that describes user objects to actually create a user object based on this class we'd say user like so and invoke it like we would a function and that actually creates a user object we call this instantiating a class or making an instance of this class so what we can do is then store this in some kind of variable now when we made variables in the past we declared the type first of all so we said something like string name X equal to something but now the type is going to be a user this is the type of data we want to store so we have to say user and then we'll say user one which is going to be the variable name is equal to a user that is going to create a new instance of this class a new object and store it inside this user variable so now I could do something like prints and then we'll say user one will get the name and I'll run this and hopefully we should see the old rather we need the user name not name okay my error we'll run that again and hopefully we should see Mary oh we do let's change this to the age and we should see 25 over here now and we don't yes we do now okay and also we could say user 1 dot login and invoke that function because we have this function defined on this class so now we have it on this instance of the class as well so if I run this then we should see this logged or rather printed to the console user logged in ok cool now at the minute if we were to create a new user so if I say user and then user - so we're just creating a new user variable and instantiating this class again to create a new object now we have to user objects user 1 and user 2 but if I do something like this prints and user 2 dots username then it's gonna be Marriott the same as user 1 dot user name so let me change this back to user name these are both gonna be the same thing Mario and Mario so every user that we create right here is going to have the user named Mario and the age of 25 and that's because we had coded them inside the class we're saying here that every user is going to have this name and this age but we can override this behavior we can use what's known as a constructor inside a class and a constructor is a special function that runs when we instantiate a class and that function can take in different parameters so we can override these values so what I'll do is remove these values from here and we're still creating these variables but we're not assigning them any values yet and then I'm going to create this special function called a constructor and this constructor has to have the same name as the class itself so it's going to be called user and we don't need to put void in front of it or anything like that this is a special constructor function and inside here what we can do is take in some different parameters so we want to take in two parameters a username and an age so that when we create a user like this we can pass those arguments in and take them in right here so to take in these parameters we need to define them we'll say string and then username so that's the first parameter we're going to take in a string called user name and then the second one we're going to take in is going to be an int called age now these don't need to be called the same thing we can call them U and a if you wanted to and just calling them the same so it's clear what each one is so now we're saying when we instantiate a class like this when we create a new user object we expect these two values a username and an age to be passed in as argue - this thing right here so we need to pass those in now so I'm gonna say that user one is now going to be Luigi that's the name that's the first argument we pass in remember it has to be a string the username and the second one has to be an integer the age so I'm gonna say that Luigi is 25 so we're passing these in now the constructor takes them to set up this user object and now we can set the values of these two equal whatever we passed in so I can say now this dot user name and that refers to this instance that we've created so whatever object we create and it's going to grab the user name of that object and it's going to set it equal to this thing right here user name like so so we're taking that value that we bring in and we're assigning it to the user name property of this instance and we're going to do the same thing for the age so this dot age is equal to the age that we bring in so now when we create a user that all gonna be unique because we can pass in unique names and ages so user two now could be something like Mario and Mario is going to be 30 so now when we print out these user names then they should be different so we should have Luigi and Mario and they have different ages as well okay so that's a basic class with some properties a constructor and also a method of function now we can also do this thing in darts called inheritance and inheritance is basically when we have a class that inherits from another class so say we have this type of user called a super user and we want it to inherit these properties and this function it has all the same properties and behavior as a regular user but we also want it to have an extra function to publish updates or something like that we don't want normal users to have that publish update function so we don't want to define that function here but we want it on the super user so what we can do is say okay well we'll create a new class called super user and that is going to extend from this class right here that means in from it so it inherits all this behavior but then we could add additional behavior and properties to that class as well so let me come down here and this time I'll say class super user and we say extends and it's going to be the user class that we extend from so now the first thing we want to do is create that extra function so this is going to be a void function and it's going to be called publish so let's create that and inside will just print and we'll just say published updates so a simple function but only super users should have this thing right here now we're getting an error at the minute right here and it says the super class user doesn't have a zero argument constructor so it's saying okay well if I was to create a new super user which extends user that's fine but you've not actually said which user name and age you want to apply to this CPU so we have a constructor here but we don't here so let's create that or say super user and we'll take in the string which is a user name again and we'll also take in the int which is the age but that's not enough now what we need to do is a colon and then say super and pass in the username that we get which is this thing and also the age okay so what is going on here well we're creating a constructor for the super user so that when we create a new super user appear much like we have done here we pass in the values use the name and age then we don't set those values right here in the super user we inherit from the user which has those values so what we need to do is call super which calls this constructor right here in the class in extends from so this thing and it passes those values in so it sets those values right here as well so now we inherit the values we also inherit the function automatically but we also have this extra function for super users so let me go to the top I'm going to create a new super user this time and I'm going to call this user 3 and send equal to a new super user and I'm going to pass in Yoshi as the username and also 20 as the age now then down here I could say prints and I'm gonna say user 3 name or rather user name and then I'm also going to say user 3 and I'm going to use that publish method down here where is it this thing right here because we have that now on this kind of super user so I'll say publish like so so if I run this it should all work we should see Luigi Mario Yoshi and then published update now if I try to say something like user to publish I'm not going to be able to do this because it doesn't have access to that publish function we can see that error but user 3 does have access to it because it's a super user and also user 3 also has access to the login function because we extended the user class right here and we inherited that login function so if I delete this and run then this should work as well published update awesome so that pretty much explains the basics of classes and how to extend classes again if all of this was too much and it went too quickly probably I would advise you to learn more about programming in general and learn about classes and things like that before you come back here and try this tutorial series but if that was kind of ok then you're in a good position to carry on don't worry if you didn't follow it all step for step if you understood the bulk of it that's good enough and that pretty much covers the introduction to dance again I just wanted this to be a primer and overview of some of the more common language constructs that we're going to see inside flutter quite frequently so we can jog straight into flutter and start creating apps and with these basics only about you're going to have no problem picking up the rest as we go on things like lists methods or string methods or more about classes and if you do want to read more about a particular method or datatype or sort how about that you can always check out the docs just go to dart lang and you're going to see all the docs for the darts language or right here so you can go to Doc's and anything you want to learn you can search for or you can go through the different examples they have on their website as well so hopefully now you're going to be in a good position to jump into flutter in the next video and start to learn how to create mobile apps with

# 5 - Flutter Tutorial for Beginners Creating a Flutter App in Android Studio
    alright then going so hopefully by now you've already installed Android studio on your computer but if you've not I'm gonna leave the link to where you can download it down below you can go ahead and do that the next thing we need to do is set up Android studio to work with flutter and out so we're going to crack up an Android studio and in fact the first thing we're going to do is create an Android emulator so that we can test our flutter apps on them so go to configure and then go to AVD manager which stands for Android virtual device manager and we're going to create a virtual device and the virtual device is just like having some kind of Android device like a phone or a tablet on your computer so we don't need the physical device we can test it all on our computer so I'm going to create a virtual device and we can choose from a plethora of different devices right here I'm going to go with the Nexus 6 and click Next then we have to choose a system image so the version of the operating system I'm going to go with PI because in the past whenever you used Q I've had a couple of problems with running the app so I'm gonna go with PI for now so there's no problems and click on next and then I'm going to name this in fact I'll keep the name Nexus 6 API 28 28 is the version number of the system image and down here I'll say graphics is gonna be hardware that's just gonna cause a bit of faster rendering so we have a better experience when we're testing the app okay so now click on finish and this is going to create this virtual device for you now if this is your first time doing this it probably will take a couple of minutes to install this I've done this before so everything's already installed on my computer but anyway now we have our virtual device installed alright then so the next thing I'd like to do is to install a couple of plugins and these plugins are gonna help us inside Android studio when we're creating flauta apps so head to configure again then go to plugins and make sure you're on the market place up here and search for flutter and press enter now it's probably going to be the first entry that you see right here this flutter package and what this does is basically install a lot of tools into Android studio which you're going to help us when creating from applications and it's also going to add another option over here on the Start screen of Android studio to create a new flutter project which is nice so I'm gonna install that it does have another dependency which is the darts plug-in so that's the other plugin we want so click on yes to install that as well it's just going to take a couple of minutes to do this once it's done just make sure you click on this restart IDE over here that's going to restart Android studio and hopefully we should see that new option now when it starts up again cool so now we see this start new flutter project so let's click on this to create a new flutter project and we get these different options right here we're just gonna stick with a flutter application that's what we want to create so click on next then we need to give this a project name I'm going to call this my up and then down here the project location we can choose a place to store this now atom in it mine's being stored in this long-winded directory right here I'm gonna change that because I'd like to store it inside a different Drive so let me just scoot these up and then go into my D Drive open that and then into apps that's where I'm going to store my applications but you can start wherever you want on your computer okay so you can give it a description if you want to and then press next and this company domain this is basically just so it can give your package a name using this it's like an identifier for your package if you don't have one you can make one up you know you do your name something-or-other comm or something like that and then click on finish so once it's loaded that you should see something like this I'm just gonna cross off that for now and cross this as well and I'm also going to zoom in here so we can see this code okay so this is basically a sample app that flutter has created for us now before we start to even look at this code in this project I just wanted to highlight a couple of settings for Android studio because yours might not look like this when you first open it so I've gone for a dark theme and to get that you need to go to file and then go to settings and then if you go to appearance and behavior at the top open this up and go to appear the theme right here I've got selected dark color so if you want to choose that you can do by default I think it's one of these maybe IntelliJ at the bottom you can also set your custom fonts and font size now I'm just gonna crank this up to 18 and this is the UI font size so that all these things over here you can see a little more clearly so I'm going to apply that just to make it a bit bigger for you and then down here as well you can go to the editor and choose the font for that and I'm actually gonna crank this up to 24 as well just so that when I'm writing code later on you can see that more clearly okay so let's apply those changes and there's a lot of other changes and settings in here that you can make as well I'm not going to bore you with all of those but if you want to search with something you can just do that at the top all right so let's close down this guy and have a little look at the folder structure now at first glance especially when you open this it can be a little off-putting because there's so many different files and folders but it's really quite simple first of all we have our app folder I call it my up and that's where all of our source code eventually is going to go and we also have this external libraries which is for any kind of external library that we installed that our app depends on okay so inside my app we can see we have an Android folder and also we have an iOS folder now these are platform-specific folders so anything to do with Android like icons for Android devices were going there and anything to do with iOS would go in there we're going to leave those for now this Lib folder this is where 99% of our coding will take place all of our source code for our application is going to go in here and in fact this main dart file which is here that is the code for the dummy app that we get when we first start a floater project so again 99% of the stuff we do is going to be inside this live folder and you can pretty much ignore the rest for now then we also have this test folder this is for any kind of test files for testing the application that is kind of beyond the scope of this series because this is a beginner series so I'm actually going to delete this for now so if you right-click you can then go to delete down here and delete it and then we have some configuration files down here for our project as well so really it's not that complicated we're going to be doing most of the work in here occasionally we're going to be going into these files down here and possibly in the future into these but not much okay so that is the folder structure and like I said everything goes in here that we're going to be doing including this main dot dart file now when you first look at this you're gonna think hmm this doesn't look simple but really you know eighty percent of this is comments look and it's telling you what it does but if we just take a little look at this we can see that basically all we're doing is creating a class down here and inside that class we're building a widget tree so we can see this right here that's a widget and this is a widget this is a widget this is a widget this is and so forth and that's all it's doing its building a widget tree now don't worry if you don't understand all this we're gonna learn all these bits and pieces as we go forward but I do want to show you what this looks like in our Android device so remember we created that virtual device we can now open that by clicking on this no devices at the top and selecting the device that we installed so now we have this device over here what we could do is perhaps preview this dummy app inside this device so I'm just gonna make some room for this over here close that that was just my videos and then move this over here and now to preview this application over in this device we just need to click this play button right here so click on that and the first time you do this it's going to take a little while to do especially this bit when it says initializing Gradle so just be patient give it two minutes and then eventually we're gonna see a preview of the app on this device all right then so now we can see this little preview of this application now inside this device and it's very simple we just have an app bar at the top then this little bit of text and if we click on this button increases this number so not really much of a fun app pretty to show you in the code the basics I suppose of flutter all right there so let's take now a little closer look at this code and see if we can make any sense of it whatsoever so I'm gonna minimize this console and also click on this project tab and that's going to hide this file structure right here so we get a bit more room for the actual code so what we have over here let me just zoom in a little more is an import statement at the top we're just importing darts and then we have this main function remember I said that the main function was the first function that fires when the dart file starts so that is firing and then it's returning in an arrow function this run app function over here so this run app function is starting our app it's running the app and inside we pass this thing right here my up now the thing we pass in that is going to be a widget and it will be the routes widget of our application so we're saying here the route widget should be my up and we define that widget down here remember before we said that widgets are just classes so we're creating a class called my app which extends stateless widget now don't worry too much if you don't understand all of this for now just know that we're basically creating a new widget called my up okay and that is the route widget so inside here we have a load of Kodomo Clio 3 all now we'll talk about it later as we build our own app but we have this build function which is building our application and we're returning a widget in here called material app so the material app widget is a widget which is kind of like a wrapper and it allows us to do a lot of material design widgets inside it like this and this so inside that material app widget we have these different properties a title a theme and we also have this home property now this home property said okay well what widget should load on the home screen and right here we're saying well we'll load this widget and we're passing a bit of data into that widget as well so this widget down here is my home page extends stateful widget we have some code here again don't worry too much about that and down here we have again the build function and that is building our widget tree inside it a scaffold and up bar which is this thing over here we have a text widget inside that we also have the body property which is the actual content of the screen we have a center widget to centralize everything a column which column eyes these things and then down here we have some text for this we have text for the counter itself and at the bottom we have a floating action button as well so this is basically just building a widget tree of contents for the screen so again don't worry too much about this I'm just giving you a quick overview now but I know it's coming out you're pretty hard for pretty quick so what we're gonna do is actually delete all of this so let me grab all of that delete it because we're gonna start from scratch and in fact I'm gonna delete this thing over here as well now at the minute if we try to run this it's not going to work because we're not passing run out a root widget so let's do that now I could make up my own class my own widget like we saw in the dummy code but instead what I'm going to do is just place in the material app widget right here instead and we can do this we can use this as our routes widget and what this is basically going to do is allow us to create a blank app and use Google materials design features inside this application it's like a wrapper for the rest of our widgets in the app okay so let's open up this material app so inside our widgets we can specify different properties like I said before so what I'm gonna do for now is just specify the home property and this home property is going to have inside it a text widget so we say text like so and this creates a text widget for us and inside this text widget we can pass a string and I'm just gonna say hey ninjas like so and after this I'm going to place a comma because commonly we have different properties inside our widgets and their comma separated so if I wanted to do another property I could do it after this they have to be comma separated so it's always good practice to put a comma after your property value over here so right now we're saying okay run the app use this material app as our root widget and this material app is going to act as a wrapper for the rest of our widgets inside it now the home of our material app is gonna be just a text widget so we're saying the home screen at the minute in its entirety is just gonna be a text widget and that is gonna say hey ninjas okay so let me now preview this over here in fact if you go to run over here you can just do a hot reload and that's going to do the same trick so if we press that now we can see hey ninjas looking very ugly in the top-left corner over here okay then so now we have android studio up and running and we have a pretty blank slate for our app let's take this one step further and start adding more widgets inside our app

# 6 - Flutter Tutorial for Beginners Scaffold & AppBar Widgets
    okay then gang so we've seen now how to set up a very very basic hub using the material app as our root widget right here and it acts as a wrapper for the rest of our app now inside it we have this home property which remember specifies what is going to be on the home screen when we load this app and inside that at the minute we just declare a single text widget which says hey ninjas and we see over here looking at a rather ugly so this is all a bit boring at the minute and gradually what we want to do is add more content to this screen to make it look a bit better so to do that the first thing we're going to explore is a widget called the scaffold widget now the scaffold widget is going to allow us to implement a basic layout for our app it's going to allow us to set up an app bar at the top some floating action buttons every one and more so what we're going to do is actually delete this text widget for now and we're saying now the home property should be a scaffold widget and by the way all these widgets come built into the flutter SDK out-of-the-box we can build our own widgets later our own custom ones but these ones come out of the box that we can use so anyway this scaffold widget is going to take a multitude of different properties so we can specify different things about the base layout of our app the first thing I'm going to do inside this is an app bar property so up bar like that and this app bar property is going to specify how our app bar is going to look at the top now the value of this property is actually just going to be another inbuilt widget which is called up but like so and notice the convention our widgets are all starting with a capital letter and each new word starts with a capital letter as well that's the convention of these widgets so inside the scaffold we now have the app bar property and the value of that property is an out bar widget now remember I said put a comma after every value of every property so let's put a comment there and also a comma after scaffold as well just in case we had more properties down here later on okay then so inside the app bar we can also specify a couple of properties and this is the general pattern here we have a property with a value which is sometimes a widget and inside that widget we can have more properties and sometimes the values of those properties and widgets and it's had those widgets we can have more properties and so forth because we're nesting widgets within widgets remember that widget tree structure I showed you in one of the first slides that's basically what we're doing here programmatically creating a widget tree and each widget has different properties so the first property of this app bar is going to be the title property and this is going to say what is actually shown what text is shown on the title of the app bar now you might think we can just say something like this hello and pass a string but that's not the way flutter works if we want to output some text we need to use a text widget so we can say text like so and then put the string and what we want to show as the title inside this text widget so I'm just going to say my first app okay so let's try previewing this I'm going to save it now and go to run and I'm gonna go to hot reload right here or rather hot restart this one's hot reload we'll talk more about that later for now just click on hot restart it's a bit like a refresh button for you to see the new screen so let me press that and now we can see this app bar at the top it's all done for us we didn't have to do any kind of styling or anything like that it just comes out of the box we can change the colors and I'm going to show you how to do that later on but now we can see a pretty decent looking title bar or app bar at the top with a title on it now at the minute this is left-aligned and this is how it looks on Android devices most of the time so what I'm gonna do is use a property called sensor title to essentially align this and this we can just set to a boolean which is going to be true so this doesn't have to be a widget this is just an option if you like we're centralizing this so we set it to true so if we save that now and then we go to hot refresh or hot restart then we can see it's now in the sensor cool so that's our app bar done so inside the scaffold now I'm going to add a second property after the app bar so let's now UPS and do that for a start and let's now go on to the next line after the up bar and this time we'll do a body property now this property is going to specify what content is going to go inside the body of the screen so anything under the app bar over here now all I'm gonna do is add in a text widget and I'll say hello ninjas okay so if I now save this and go down to run and press hot restart we should see this over here hello ninjas okay so it's quite small but we'll talk about textiles later on and it's also in the top left now when we viewed that dummy project it had the text in the center and it looked a bit better so now I want to do the same thing and the way we do that is we wrap this widget inside a center widget so I'm going to actually cut this for him instead of directly putting the text inside the body property I'm going to do a center widget like so so a center widget centralizes whatever is nested inside of it so inside the center widget we're gonna have a child property we don't just place in the text like this we always have to have properties inside widgets and when we nest something directly inside another widget it's normally the child property that we use so we're saying okay well the child of this Center widget the thing we're nesting inside it is now going to be this text widget so that means that it's going to centralize this text widget on the page so if I save it and go to hot restart then we should see now that is in the center cool okay so let's do a one more property inside this scaffold widget so after the body we'll come down and we'll do another property called floating action button and this is basically get a place as a little floating action button in the bottom or right corner so the value for this property again is going to be a widget because like I said we have widgets as values to properties a lot of the time so this widget is called the floating action button now just delete that on pressed we're going to cover that later don't worry about that now that's how we react we use a pressing this button but for now I just want to show you how to get one on the screen so comment after that then inside the floating action button again we have a child property because we're going to nest another widget inside this widget the floating action button just gets us the button with nothing inside it but we want to show text inside it so we'll say that the text widget is going to be a child of this and inside the text widget we'll just say click that's what the text is going to say so let me save it and then hop restart come over here and we should see now this floating action button with this click message inside it now nothing happens when we click on this because we deleted that on pressed property but we'll talk about that later on for now I just wanted to show you how to get a pond ring with a basic layout like this and how quick that was using this scaffold widget right here so remember the scaffold widget is basically like a wrapper to a few different layout widgets things like the app bar the body and also a floating action button ok so generally speaking when we're creating apps we're going to be using the scaffold a lot to flesh out the general layout of our apps but if you want to read more about it now then you can go to the scaffold class on the floor to Docs I'll leave this link down below so you can go and check it out and if we scroll down here it gives you some different examples it looks very similar to what we've done over there and if we scroll down even more then we're going to see all of the different properties we can add to the scaffold widget so app bar we've seen that because I've done that background color body we've got that we've also got these others down here there's loads of different properties so you can have a play around with those if you want to but we are going to explore them more as we go forward as well this is just an introduction to it

# 7 - Flutter Tutorial for Beginners Colours & Fonts
    alright then so far we've added a few different widgets to our app inside this scaffold widget right here and it's looking alright but it still all uses the default material design styles so this is the default material design blue the default fonts the default font size etc it would be nice to be able to customize this a little bit so we're going to look at some different colors and font styles in this tutorial so first of all let's look at the app bar what we're going to do is add a property to this app bar called background color so let me do that background color now the value of this is going to be a material design color and we have access to the whole material design palette which is something like this over here I'm on the material design website right here and we can see we have a huge palette of different colors so we've got blues purples greens yellows and they all have different shades as well so we have access to all of these different colors inside our flotter apps so let's try using them the way we use them is we tap in to the colors with a capital C and then we say dots and then we can choose from any of these different things here now each different color has different strengths as well so for example I could say something like red right here and then if I wanted to I could give this a different strength so this is the default strength of the red but if I now press ctrl Q while this is selected I can scroll down and see if we add square brackets at the end of this then we can choose one of these different strengths of a red so if I want X lightly deeper I could use this one for example red and then 600 so let me now choose red first of all then in square brackets I'm going to add in 600 and that gets me that color we just saw so now if I was to save this go down here to run and hot restarts then we should see this turn a red awesome okay so let's now go down to the floating action button and by the way you'll notice this is kind of highlighted that's flutter telling us that something is not quite right here so if we hover over it we can see the parameter press is actually required and that's because this is a button and buttons are there to be pressed and we need to add this in so I'll add it in quickly now but we'll come back to it again later on I'm pressed is just a property which is going to be a function and it's an anonymous function we don't need to give this a name and something is going to happen in here later on if we press this button again we'll talk about this a bit later on I just wanted to add that property in so that for to stop shouting at mate regarding this widget okay so let's also add a background color for this thing right here so if we come down here we can say background color and again I'm gonna give this a colors property then choose red again and 600 again you can choose whatever you want and trying to keep things consistent right here so let me save it and if we HOT restart we can see hopefully now that this is going to go red all right cool so now let's turn our attention to this little bit of text in the middle because at the minute it's a bit small I'm not so keen on the font family and maybe you want to make it bold give it a color as well so let's go to this text so at the minute this text widget right here just accepts a single string but if we want it to accept different properties as well then what I'm going to do is cut this string and gone to a new line open up the widget much like we have opened up other widgets where we add properties and the first thing we add in is the actual text string so I'm just going to add this back in hello ninjas and then the second property can be something called a style property now this style property is going to ultimately allow us to style this text in different ways and we need a widget to do this and this widget is called a text style widget like so so we have the actual text and then a style property called text style now inside this widget we can pass different properties to style our text and there's loads of different properties we can use now to find out the properties you could go to the documentation or if you select one of these you would just put your cursor on it and then press ctrl Q you can see all of the different properties we can use so for example we can use background color which must be a color fontsize which must be a double we also have a font style font weight height etc so there's loads of different properties that we can use inside this textile to style this text so I'm going to start with a font size and this is just going to be 20 so if I save this and preview by pressing this button then we should see that this increases in font size awesome now let's do the font weight and we don't just say something like bold or something like that these font weights they're all built in to the flutter SDK the flutter library so what I'm gonna do is say fonts weight and that's the font weight object or font weight class and then use the bold property so a lot of the times we use something like this if we're doing font weight not phony weight font weights then we use the font weight object if we're doing something like a color then we use the colors object like this alright so the font weight is now going to be bold now before we preview I'm also going to add in another couple of properties the next one is going to be a letter spacing and that is going to be two and then after that I'll also do a color and this is going to be colors and then we're going to call this gray and do a shade of 600 so if I save this now and then hot restarts this should take shape okay look in a bit better now we can also add in different font families so this at the minute is the default font family but what I want to do is add in a custom font so the first thing to do is actually get that custom fonts and add it into our project so I'm going to open up my browser and I've already gone to the google fonts website it's just fonts google.com and I'm going to choose a custom font that I can use in this project now I'm just going to search for this because I know what it's called it's called Indy flower and I'll grab this one right here so I'll press the plus icon and then open this up and I want to click on this icon at the top right to download it so I'm going to save the file and once it's saved I'll open this up and I'm going to extract this first of all extract all to the same location and then we see these fonts right here now what I'm going to do is drag these fonts into my project but before I do that I need to make a folder to put it in so in the root directory my app right click and then we're going to create a new folder so go to new and then go to directory and I'm just going to call this fonts and then I'll open up this thing again and I'm gonna grab this and I'm gonna place it into fonts okay and then what we need to do is tell flutter that we have this fonts are ready to use now the way we do that the way we add these different assets and fonts and things is by going to this pub spec Yama file now this file is a bit like a configuration file for our project it's where we can specify the environment dependencies or any assets and fonts that we want to use in our project as well now the format of this is very very important notice we have these different properties that are flush opening to the left and then when we use a sub property inside that it's two spaces indented if it's not then it won't work so it has to follow that format so be careful you don't do three spaces or something else so if you scroll down you're gonna find a place where we can add fonts like this now it's all commented out at the minute so I'm gonna highlight all of this all of the fonts and then I'm going to press ctrl on Windows think command on a map and forward slash to uncomment now notice it's not quite flush yet so I'm just gonna grab all of this again and I'm gonna zoom it back to and then zoom it forward one so now it is in alignment with the rest so you can see we have this fonts option right here and underneath we define a family now this is a name that we give to this font family and then we define where those assets actually are so we just have one font asset right here so what we need to do is actually delete most of these things and just leave one asset right there and I'm going to name this one instead India flower so that's the name and giving to this font I can call it whatever I want but it makes sense because that's what it's called and then I need to give a path to this font now it's still in the fonts folder but this time it's called something different it's called Indy flower and then - a regular TTFN so now we've added this fonts inside our pup spec file so all I have to do is save this and then I'm going to go back to main dot now notice I get this notification pup spec has been edited so we can click this to get any dependencies that we need now so let me now minimize that and now we can use this font by referring to this font name right here so inside the text style widget I'm now going to add on another property and that property is going to be font family now I'm going to say in the flower which is what I called the fonts inside pub spec right here if I call it something different I'd refer to that and then this should work so if I save it now go to close off that folder and then I'm going to go to hot restart and hopefully it will see the new font over here hello ninjas awesome so they're my friends that's a bit more about colors and a bit more about font styles in flutter but the minute there's one thing bugging it and that is that every time we save the file and we make a change and we want to see that change in the screen over here we have to come down here to the run panel and then press this hot restart button and only then can we see that change so I'm gonna address that issue in the next video so that as we save our code it automatically updates on the right and we don't have to keep pressing this thing over here

# 8 - Flutter Tutorial for Beginners Stateless Widgets & Hot Reload
    alright then so right now when we make any kind of change to our app in the code over here and we want to preview that change what we have to do is go down to this run tab down here and then click on this hot restart button and then that essentially refreshes the app over here so we can see that change now that's ok but we're making changes quite a lot and we have to keep going down here and pressing the refresh button and it would be nice if there was a simpler way now flutter also comes with something called hot reload meaning whenever we make a change and save it over here the app can auto reload in the preview screen now right now that's not working and that's because of how we're structuring our code over here in order for us to use hot reload we're gonna have to talk about something called stateless widgets so what I'm gonna do is come down to the bottom over here and I'm going to create a stateless widget first of all now we can do that using a little snippet in flutter just st which stands for states and then less and then tab and it creates this class and this is going to be a custom stateless widget class so we're gonna give this a name I'm just gonna call this test and what we're doing is just creating a class called test which extends stateless widget so in essence we're making our own custom stateless widget here now pretty much everything remember in flow to every widget is just a class so when we're using these things up here like the text widget the floating action button widget the textile widget is Center widget these are just instances of those classes in a flutter these are all just widget classes now these are all built into the framework what we're doing down here is basically making our own widget class and that's extending the base stateless widget class in flutter so we're inheriting all of those call functionalities in stateless widgets now I keep using the word stateless when I talk about this widget but what does that mean exactly well in flutter we can have either stateless or stateful widgets right now we've created a stateless widget and that basically means that the state of the widget cannot change over time for example the layout or the colors or any data we use inside that widget has to be final and it cannot change over time as we use the app it can contain data but that data can't change after the widgets been initialized stateful widgets on the other hand they can contain States which can change over time so things like it's call it's layout or any data inside it it can change over time so for example some kind of counting widget that displays the number of flies that you SWAT on an app that would have changing data over time as just what more flies on the screen the number would go up right so we would use a stateful widget for that so depending on what we need in our apps for our different parts of it our different widgets we'd either choose a stateless widget or a state full of widgets right now we're using a stateless widget but later on in the course we will also look at stateful widgets as well okay then so at the minute we're creating this stateless widget right here which is called test and I'm gonna rename that home because ultimately this is going to represent all of the content we're going to show on the home screen and this is extending stateless widget which means we can't have any state that changes over time inside this widget now I mentioned that the reason we're doing this well one of the reasons we're doing this is because it's going to enable hot reload for us and we'll take a look at that in a minute but another reason we're going to do this is because it's going to make our code drier and much more reusable we can easily reuse our own custom widgets later on and we'll see that in action later in the course but anyway how does this stateless widget help with hot reload well first of all we have inside it this build function right here and we can see the return type in front of the function is a widget and that's what we're doing inside this function we're returning this container widget right here now we've not seen the container widget but don't worry about that for now all we're doing is returning a widget now ultimately what I want to do inside this widget is return a widget tree of our homescreen now we've already kind of created that over here we've done it directly inside the material up inside the home property so what I'm going to do is just copy or rather cut all of this scaffold stuff everything inside it I'm gonna cut it so we're just left with that home property and I'm gonna return it inside this build function so now we're returning this widget tree which starts with the scaffold and all of the different widgets inside it nested now at the bottom I just need to get rid of this comma because now we're not adding another widget after it we just replace that with the semicolon because remember we're returning something here and at the end of a return statement we have a semicolon anyway now we're returning this widget tree but back to this build function how is this helping goes with the hot reload problem well this build function right here this is what is responsible for building up the widget tree inside the stateless home widgets so all of this stuff right here now whenever we make a change to the code inside this widget tree flutter is going to detect that when we save it and it's going to cause the build function to rerun now when this reruns flutter is going to update what we see in the screen over here that's hot reload in action now it doesn't mean to rebuild the whole app that we create just where the code changes inside it so in the future we could have many different stateless widgets and if we make a change to one of them inside our code flutter only needs to rebuild that widget for us and update that on the screen so that's going to result to a much quicker update in the device preview so we don't have to go down here now to run and then Hawtree start to see that in action so let's do now a little change all I'm going to do is just come down to here and say click me and press save and now if we do this then we have an issue so let's go down here and okay I know why this is it's because we're not actually using this home widget we've built this widget but we're not actually using it anywhere and what we want to do is use it for the home screen in the material app so let me now do that and we're saying okay well for the home screen we want to use this custom home widget that we've created right here which is returning this widget tree so now all of this should show on the home screen so let me now save this and now it's reloading and now what we to begin with is one quick hot restart first of all just to capture any changes then you can see click me now if I take that off if I change something inside this widget and save it now it should automatically reload over here we don't have to go to run and then hop restart again because we may be changed inside this build function right here and it's detected that change its rerunning the build function and then updating that over here that is hot reload in action now I said that this makes our code drier when we use our own custom widgets like this and it does and that's because we can now reuse this home widget anywhere else in our app if we want to we might not necessarily do that because we only have one home screen but if we made up a widget that we want to use in several different places on different screens in our app we could then reuse this same widget every time we need it instead of rewriting out the code for every place we just put it in a widget like this and then we use an instance of that widget when we need it like this so that's nice now there's one more thing I want to talk about in this video and that's this override thing right here now this is used to say that this build function right here will override the one defined in the classes ancestor so the thing that we extend from which is stateless widget because that has its own build function as well so we're saying we want to use this build function because we're using this override thing right here we want to use this build function instead of the one we initially inherit from this stateless widget that's all this means we're redefining the build method right here so now we've done that whenever we make a change we don't need to click our hot restart anymore well we will be using that later on when we start to use state and we want to reset that state or data in our app but for now we don't need to worry about coming down here and clicking this every time we make a change

# 9 - Flutter Tutorial for Beginners Images & Assets
    all right and so there's a couple of different ways that we can use images inside our flutter apps we can use either a network image which is where we go out and we grab an image from the web that's already hosted somewhere or we can use an asset image and that means that we using an image from our source files over here so I'm going to show you how to do both of these and we're going to start with the network image so what I'm going to do is come down to the body property in the scaffold and we have this sense of widget and inside we have the text I'm going to get rid of the text widget and we're going to replace this with an image so to do this we use the image widget and then inside that we have an image property now I said I'm going to show you how to do a network image first of all so to do that we say network image like so and we need to pass through here a URL to that image and we also need to make sure we spell image correctly or like that okay so now I've gone to unsplash already and I found a space image that I really like so I'm going to right click that and I'm gonna go to copy image location to get the URL then I'm gonna go back to my editor and I'm gonna paste that URL inside this network image like this quite long but there we go now if I save this hopefully we're gonna see an image over here cool it all works so that's it that's how simple it is to get a network image showing on your app now the other way to use an asset image is slightly more complex but not overly what I'm going to do is undo this and undo that paste and I'm going to change this into an asset image instead now we need to paste in a URL to our image right here but this time it's gonna be like a local URL because our image is going to be stored over here somewhere so the first thing I'm gonna do is right-click my up and go to new and then go to directory and I'm going to call this assets and then I'm going to store my images inside this folder so let me open up my downloads I've already downloaded three space images from that unsplash website and I've called them Space 1 space 2 and space 3 I'm just gonna drag them into that assets folder right there so then we should be able to use them so if I expand this we're going to see space one two and three and their old JPEG files now before we actually use these before we offer a URL to these different images inside the asset image we need to say inside our pup spec file over here that we want to use these images as our assets so let's open up this and it's going to be very similar to how we set up the fonts but we need to scroll up a little bit from the fonts until we come to this thing over here where it says assets so I'm gonna uncomment that and then I'm going to delete the space here that we have so it becomes flush and bring these two in as well no they're fine as they are okay so it was just this one you need to bring flush with this line okay so now what we need to do is say okay where are our assets stored which assets do we want to use and we can see right here there's a couple of examples already it says it's in the images folder then a dot BER and then a dot ham so we don't need these because they don't exist instead we want to do inside the assets folder and then forward slash and then whatever the name is so space - 1 dot jpg so I'm just gonna do one of them for now I'm gonna save this then go back to main darts and I'm going to click get dependencies this always happens when we change our pub spec file it's always a good idea just to click get dependencies to make sure everything's up to date and then what I'm going to do is add in the URL to this thing right here so it's from the root folder so I say going to the assets folder first of all then get the space - want JPEG image so if we save this now hopefully this should work and it does but if we try to get the space to image then this is not going to work and that's because we've not declared that we want to use space - here we could do that we could come down to the next line and say assets and then space - - JPEG and then this will work if I save it and then come over here this does work okay let me just click get dependencies get rid of that notification but if we had a lot of different images say I don't know 15 in total then we'd be right in all 15 of them out like this and that's a waste of time and space so instead what we could do is just write out the assets folder like this and save it and then what that allows us to do is use any images directly inside this assets folder if it's in another folder inside that folder then it might not work but we need to just declare the folder name to use any assets directly inside that folder so if we save this and then go back to main data I'm going to click get dependencies you can see this still works if we do space one that is hopefully still going to work and also space three that works as well so just two steps all we need to do is declare our images or assets or the folder where they are stored inside the assets option in the pub spec file then we need to just do a URL to that asset inside the asset image widget okay so then there are two different types of humans we can use a network image and an asset image now instead of writing this all the time flutter has given us some shortcuts to do these two types of image so what we could do instead is just delete all this and then say image dot asset and then the URL so that's going to be assets and then forward slash space - one jpg for example and this will still work so we don't need an image widget and then nest an image property inside it with the asset image widget as well we can just say image asset as a shortcut and then do the same thing and the same applies for image dot network obviously we need to update the URL so I'm gonna go to copy image location again and paste this in like so save it and we should be able to see that image as well so there shortcuts for adding images now just a quick side note I know that at the moment we're only adding one bit of content to the page in the body at a time now this is going to change in the future so that we can have multiple bits of text and images etc showing on the page at the same time I just want to show you a few basic widgets that we can use first then we're going to start playing around with layout and adding more stuff to the app

# 10 - Flutter Tutorial for Beginners Buttons & Icons
    or rather than gang so in this video I'd like to show you how to use icons and buttons and then a mixture of the two as well so I'm right here in the center widget now and I've stripped out the images from the last video and we have this child property we need to specify a widget for the child and what we're going to do is look at icons first and to do that we'll use the icon widget that's simple so let's open this up and the first item inside this icon widget is going to be what icon we actually want to use now we can use any icons from the material design library and to access those and to see them we say icons and then dots and then we can see all of the different icons available to us right here the name of them and a sync preview of how they look as well the one I'm going to use is called airport underscore shuttle which is like a little boss so that's all I need to do that's the first parameter and if I save this now then you should see that little icon right there in the center now we can customize this a little bit if we want to so I could give this a color by saying color and then that's going to be equal to colors dots light blue for example if I save it again then now this is going to be a light blue now that's tiny in a minute so if I wanted to increase the size I could give it a size property and so 250 for example and save that and now it's a bit bigger okay so that's it that's an icon that's how simple it is we just use the icon widget the first argument is going to be the actual icon we want to use then we have these other different properties as well and again if you select one of these widgets and press ctrl Q while it's selected you can see all of the different properties we can use inside the icon widget okay so we've seen an icon now let's have a look at buttons so there's a couple of different type of buttons first of all I'll show you the raised button and by raised I mean that it sits away from the page so we should have some kind of shadow and inside this button first of all we're going to do an on pressed property because if we don't have that then flutter is going to shout us because buttons are there to be pressed and this is a acquired property so impressed is gonna equal two and then all of us function for now meaning that it doesn't have a name and we might come to that in a minute and I'll show you what can happen when we press a button but for now let's just leave it blank now what else do we want inside this button well we can specify text inside a child property so remember when we're nesting a widget inside a widget we use this child property a lot of the time now we want text inside this raised button widget so we're going to use the child property and then nest a text widget inside it alright so whatever we type in this text widget is going to appear on the button so I'll just say click me like so and I'm going to save that now and we should see a button now that says click me awesome now if we wanted to we could open this up and we could you know do a textile as well to style a text inside the button I'm not going to do that I'm going to leave it as this for now keep it nice and simple but what it will do is add on any color property to this button and I'm gonna say colors and then let's just use light blue again you can choose whatever color you want save that and it says click me and if you look really closely by the way you can see that this is a raised button because it has a little shadow it's raising it away from the page giving it that kind of 3d effect so that's a raised button just as easily we can do a flat's button so I can say flat button and then save this and then now it's going to take away that shadow so that's the major difference there one of them has a shadow that's the raised button one of them doesn't ok so I said I'd come back to this on pressed property right here so this on pressed property takes a function as a value and inside the function this is code that we can execute when someone presses this button so for example I could do something like print a statement to the console and I'll just say you flicked me okay so now if anyone ever clicks this button then is going to fire this function and print this to the console now I'm gonna save it and I'm also going to open up this run tab down here and I'm gonna go to click me and you can see now this is printed to the console so whenever anyone clicks on this button now this function is going to fire I can do it again and it happens again awesome so that's buttons in a nutshell and again if you click on this press ctrl Q you can see all of the different properties that we can give to a button as well so now I'd like to show you how to add an icon inside a button with some text as well so let me now get rid of the flat button and what I'm gonna do instead is say okay we'll have a raised button and then I'm going to also say after this button dot icon and that means basically we want an icon inside this button as well so inside this and first of all we're going to say unpressed I'm going to leave this as a blank function we don't need to do anything inside it and then under that I'm going to do an icon property and this needs to use the icon widgets and then the icon I want to use is going to be just the mail icon like that now I'm not going to edit with the color of the icon or anything like that I'm just going to leave it as is the next property I'd like to do is going to be a label praten and a label property is going to be the text which sits next to the icon so I'll just use a text widget for this and the text can be male me something like that and then finally let's give this a color and we'll do colors dots amber something like that okay cool so if we save this now it looks something like this and again if we wanted to customize the icon with the color and the size we can do same goes for the text we could make this white and bit bigger something like that it's up to you all the customization options are there and available to use but anyway that's how we add icons inside buttons like this now I want to show you one more thing and that is something called an icon button which is basically just a small icon which can be pressed basically so let's get rid of this again and finally I'm going to say this time we want an icon button and then inside this we need the on pressed property first of all which is going to be a we're not going to put anything inside that function for now we know how it works now and then underneath that I'm gonna say the icon is going to be an icon widget and we want the icons and then dots let's just use alternate email which is the @ symbol and then after that we'll specify a color and we'll make this Amber so we'll say colors dots amber like so okay so have we done this correct I think so let me save it now and now we can see this little @ symbol doesn't look much different from where we just had an icon the only difference is now it's pressable on this function will fire when we press it so let's just say prints and then you clicked me like so save it and now when we click this icon we can see you click me so that's the major difference between just using an icon and an icon button so hopefully now you've got the general idea of how to use icons and buttons we are going to be using them a lot in our project as we go forward so don't worry you will get more practice and I will show you different properties we can use inside them this is your introduction to them

# 11 - Flutter Tutorial for Beginners Containers & Padding
    alright then so now we've seen a few of the basic UI widgets that come along with flutter now let's turn our attention to layout so one of the simplest layout widgets that flutter has to offer is the container widget and it pretty much does what it says on the tin it acts as a container to another widget or wraps around it it's basically a convenience widget and it comes along with some properties like margin and padding and color etc so let's now try to create a new container widget and see how it works so inside the scaffold in the body property I've stripped everything out so before we have the center widget and some icons or text inside that I've stripped all of those away and now the body is gonna be a container or widget that's it so if we save this now then we're not going to see anything on the screen nothing happens because like I said this is just a container for all the widgets now there's several different properties we can apply to this container one of those properties is going to be a color property and that sets the background color of this container so what I'm gonna do is just set this to be gray and then we'll give this a strength of 400 so if I save this now then you'll notice the whole background area of this body now turns gray so when we create a container and it's got no children widgets inside it that container takes up the full space available to it in this case the whole body the whole screen inside the body now I said that a container acts as a wrapper to other widgets so what we could do is add on a child property and say for example we want to import some text into this container then I could do a text widget and just say hello and then if I save this now watch what happens we get hello up here and now the container the gray bit is only the same size as the widget inside it so if we don't have a child which inside it if I get rid of that then the container takes up the whole room available to me but the minute we have a child for example a text widget then the container restricts itself to the size of that child widget so in this case the size of the word hello okay so that's how a container works now one of the good things about containers is that we can add padding and margin to our child essentially and the way we do this is by first of all just using a padding property and remember padding is the inside space of an element so margin is the outside space the space outside the text and contain it if you like and the padding is the inside space so the space inside the container that is going to surround the text and we'll see the difference in a minute anyway for padding how do we do this we don't just write a number like 20 or something like that instead we have to use something called edge in sets so edge in sets is how a control space like padding and margin inside flutter now we say edge insects dot and then we use one of these different options symmetric and symmetric lets us control the padding across and upwards so if your up and down margin or up and down padding is the same and your left and right padding or margin is the same then we use symmetric and I'll show you that later on or we can use from left top right bottom so we specify individual values for the left margin or padding rather the top padding the right padding and the bottom planning so we can approach all of those different may if we have different values for each one or we can use all and that basically applies the same margin or padding around all sides and that's what I'm going to do for now so let me just say dots all and then we pass in a value here which is gonna be I don't know 20 so within here apply 20 pixels of padding around all edges so if I save this now we can see the inside space inside the container around the text is 20 pixels of padding in each direction now if I change this to for example symmetric let me do this symmetric and press Enter now this takes two parameters we need a horizontal value for the panning across and a vertical value for the padding in the vertical direction so let's do the horizontal first and we'll say that is 30 and then we'll also do a vertical and we'll say that is 10 so up and down it's gonna be 10 pixels of padding and left or right it's gonna be 30 pixels of padding now the other option was to use something called from left top right bottom so this allows us to pass four values one for the left one for the top one for the right and one for the bottom so I could say 10 and then oops it's in point zero then I'll do 20 point zero then I'll do 30 point zero and then finally at 40 point 0 so left 10 pixels top 20 pixels right 30 pixels and bottom 40 pixels of padding so if I save this now it's gonna look something like this okay so they're the different kind of values we can use for padding and it's exactly the same for margin so I could now do another property margin and then oops it doesn't know how to be in capitals margin and then this is going to be edge in sets as well and what I'm going to do is all to specify margin all the way around but we could use this as well if we wanted to or symmetric and I'm just gonna say 30 pixels all the way around so if I save this you're going to notice 30 pixels of margin around the container so padding is inside the container and margin is around the container okay cool so that's how we use containers to surround a child widget if we want some kind of container around that to give it some margin and padding now say for example I wanted to apply some padding to this text widget but I didn't need the margin and I didn't need the color well in that case we could use a padding widget instead of the container so let me get rid of all this and I'm gonna replace it with a padding widget so inside here we can have a child property and that is going to be a text widget which just says hello and then also we can have a padding property which is going to be the same it's gonna be edge inset and we'll say dot all but we could use symmetric or the other one and I'm gonna say 30 pixels all the way around save that and notice we get the text with the padding all the way around let me change this to about 90 so it's more obvious and we can see now we get 90 pixels are putting all the way around so if you ever find yourself wanting to apply some padding to a text widget or something else then you can use the padding widget but if you need to contain it with margin as well or maybe a color for the container then container is your best bet because the padding widget does not allow margin we can't use a margin property so if I try to say margin here is going to be edge in sets all and then do something like 30 if I try to do this then you're going to notice we get a red squiggly line because we can't use the margin property and the same is true for the color property we can't apply a color to a padding widget only the padding itself so we're going to see more of containers more imagined and more of padding in the rest of the playlist as we go forward so hopefully now you've got a basic understanding of how these different things work

# 12 - Flutter Tutorial for Beginners Rows
    okay then gang so far we've only been adding one widget at a time to the body of our app whether that be a text widget or an image or a button our container or something else and that is a pretty boring so what I'd like to do is now expand our layout so that we can have multiple different widgets on the page at once da da and to do that we're going to be using a combination of row and column widgets now if you've ever used CSS grids or flexbox before this kind of layout might be second nature to you and you're gonna pick it up pretty quickly it's one of the ways in which flutter has kind of borrowed from the web but if not don't worry it's not too hard to grasp after a little bit of practice so anyway a row in itself is a widget and that widget can then contain several different widgets inside it which makes sense because we can have multiple widgets in a row on a screen can't we so let's try adding this row I'm going to get rid of that padding I don't want that anymore and instead I want to replace this with a row widget now since we can have more than one child inside a row we don't have a child property anymore instead we have a children property so we can see the suggestion or right there so I'm gonna press tab to accept that suggestion and we can see that this is now a list and the type of things in that list should be widgets so we're saying now the children property should be a list of widgets and those widgets inside that list other things that will be inside this row that makes sense so if we open this up now I can add different widgets inside this row what I'm gonna do is a text widget first of all that just says like hello world standard and then after that I'm gonna do a flat button and inside the button will do an unprecedent shout at me and we don't have to put anything inside this function for now we'll also do a color and this is going to be colors dots amber will say a nice yellow color and then also we'll do a child property so that we can have a text widget inside that button but this is how we add text inside a button it needs a child property and then a text widget so the text will just say you know click me okay so we've got two widgets now inside this row let's just do a third for good measure by the way notice and commerce separating these widgets inside this list when we looked at lists at the start of the whole series that's what I said you can comma separate different values inside a list it's just like an array in JavaScript anyway I digress the third element or the third widget is going to be a container so inside this container will do a color property first of all to colorize this so I'll say colors and then dots cyan let's go for something different and then we'll also do a padding property just to give this a bit of breathing space inside and this padding property is going to be the edge in sets and we'll choose all so all the way around it's going to have the same value which will be 30 pixels now we want something to show inside this container so I'll do a child property which is also going to be text and then I'll just say inside container in case you didn't already know who okay so now we have these three widgets bunched up together inside this single row and they're all inside this widget list right here so if I save this now then we're gonna see all of these widgets in a single row like this awesome now we have more than one widget on the page at a time so that is progress and they're all inside one row so that's good that's a good first step but notice this they all bunched up on the left side pressed against each other now that's fine maybe that's how you want them to look but you might want to spread these out differently inside the rope so to do that what we could do is use a property on the row and make sure it's on the row itself not inside the children or any other widget inside that on the rule itself we can use a property called main axis alignment so if I use that I can control how these widgets are aligned on the main axis now to explain all this axis thing I prepared a cool little picture which I'm going to show you so imagine we have our row going across like this with three different widgets our main axis is the direction of the row and the cross axis is the perpendicular direction so we have a main axis going across and across axis going downwards so we can control the layout on the main axis and also the cross axis so we're going to do the main one first of all and this is the property we use to control the layout now we have different options here and all those options are on the main axis alignment object so we can see we can use the sensor property space even less space around and space between and start now start is the default one where they're all bunched up to the start next to each other but we could use for example the sensor property now if I say this they're all going to be in the center of the world so that's nicely if you want to centrally align them in the middle we could also use a different property so I'll say dots space between and if I save this you can see now we have space between them but no space on the end of the row on the left or the right but that's good let's try something else I can use start that was the default one a space evenly is still going to space these out a little bit but now we get a bit of space on the left and a right as well and you can see the space between each element or each widget and the sides is the same it's evenly spaced let's do another one so dots end you can probably guess what this is going to do it's going to bunch them up to the right to the end of the row like this so the opposite of start and final it let's look at the other one we've got space around if I save this then we can see we have space around the elements as well and it's a bit like space evenly but notice this time the space here between the widgets is double the space between the widgets and the sides so they're the different things we can use all the different properties we can use on the main axis alignment to align these difference widgets so what I'm going to do is stick where this space evenly for now and save that so it looks something like this and we can also control how they're displayed on the cross axis as well this direction so at the minute they're all kind of in the center this is in the center of the row vertically if you like it's not at the top it's not at the bottom it's in the center but we can control this differently and the way we do that is by using the cross axis alignment property again we use the cross axis alignment object right here we have different properties we have stretch so if I did that and saved then notice they stretch the whole height of the available space we don't want that so let me take that off and choose something different I'm going to choose Center see what that does okay well that was the default value because that's how it looked before well let's choose something else will go with start and if I save this notice now that at the start of the cross axis so at the top if you like and if we do end then you'll probably guess it they're going to be at the end now it's not going to be down here and I'll show you that it's going to be at the bottom of the highest widget so this is the highest widget and this is now going to the bottom of the row which now takes up that height okay and I think what I'll do is I'll just put this to be start for now and save that so they all go to the start so there we go my friends that is rose and how we can add multiple different widgets inside the row so we can see all of those on the screen the next part of the layout puzzle is going to be columns and we're going to look at that in the next video

# 13 - Flutter Tutorial for Beginners Columns
    okay they're my friends so in the last video we saw how to create a wrote output multiple different widgets in that route on the screen in this video I'm going to show you the opposite direction now or the opposite axis which is columns so that's element stuck in one on top of the other instead of in a horizontal row so I'm going to remove all of this row stuff right here and I'm gonna replace that with a column widget instead now inside this column widget it's gonna be exactly the same kind of thing we're going to have a children property and that is going to be a list of widgets like this so inside here all let's now place a few different widgets so we can see those in a column on the screen so all I'm gonna do is make three containers I'm going to keep this simple and each container is going to be colored a little bit differently and sized differently so we can see the difference between them so inside the first container let us now do a padding property and for that we need our edge in sets all the way around and it's going to be 20 pixels in each direction then it will give this a color property we'll use cyan as the first color and then finally we'll do a child which is going to be a text widget and inside here we'll just say you know what something like that okay now it's telling me cyan is not a color oh that's because this needs to be colors not color so that should be fine now if I save this we should see one over there cool so this works now what I'm gonna do is actually just copy and this dude and paste it a couple of times below because we're just gonna have three containers and all I'm gonna do is change the padding value for each one so I'll change this one to 30 and this one to 40 then I'm also going to change the colors for each one so let's see what coming out for this one colors and let's do pink accent for this one and then over here colors and let's just do amber for this one so now that all different colors and all different sizes we need to change the text in each one so that's going to be two and this is going to be three so if I save this now we can see these three containers on top of each other in a column so remember a column goes up and down and a row goes across now before when we started to lay these out we use the main axis alignment property to lay them out in a row and across axis alignment property to lay them out vertically now its opposite for this because the main axis in a column is vertical right that's the main axis now and the cross axis in a column is horizontal so if we want to control the main axis alignment the vertical alignment in the column here we use the main axis alignment property so let's try doing up inside the column because it the minute these are all just bunched up at the top so let me do main axis alignments and we need the main axis alignment object then let's try sensor first of all so this places them in the center of the column cool let's try something else I'm going to try dots end and no surprises this is going to go to the end and let's try something else I'm going to say now space evenly save it and we can see these spaced evenly so it works exactly the same way as a row but just in the opposite direction the opposite axis so we've done this one now let's try the cross axis alignment so let's use that property and get the cross axis alignment object like so and I've said for the first one here dot stretch now what do you think this is going to do well if we save it we can see that now they stretch across now there's still a gap between each one because we've said spaced evenly in the cross alignment but if I was to say something like and then they're going to bunch together at the end and that was quite nice okay so let's explore a different property here we'll say cross axis alignment and then we'll say Center and that is basically the default because they're all in the center of the column this one is in the center this one is in the center and this is the full width of the column if we change this to start then all going to be bunched up the left of the column if we change it to end then they're going to be bunched up to the right of the column so the best way to get familiar with these columns and rows and these different axis alignments is to just play around with them and just try out different layouts with these columns and rows now the cool thing is is that we can add a row inside a column or a column inside a row for example I could come down here inside the widget list and add a row as the first widget and inside this row and do my children property which is going to be a list and inside this I can just do a text which is going to be hello and then I'll do another text widget after that inside this row which is going to be world okay so now we have at the top of the column a row as the first widget then three containers and inside the row we have two widgets text and text so if I save this now we can see that this is the first widget and it's above the rest of them now these have all gone to the end over here because we have a row now which is taking up the full width of the page so now the column is full width and we said over here that we want the main axis alignment to be end and the cross axis alignment to be end so that's why they're over here at the bottom so there we go my friends that is columns and rows in a nutshell again just play around with these work on different layouts and you will get the hang of it in no time and we are going to be using them quite frequently as we go forward so you will get more practice as we continue as well

# 14 - Flutter Tutorial for Beginners Flutter Outline & Shortcuts
    or rather gangs so hopefully by now you should be getting a little used to creating widgets and creating very very simple layouts using a row or a column or combination of both now what I'd like to do is just sidestep for a few minutes and show you a few shortcuts and other tricks I was just going to show these in different videos but I thought it would be best to have a whole video to show you how to do this so first of all I want to show you the Action menu for each different widget that we create so we can see down here we've created all these different widgets right and seeing the future I wanted to place for example padding around one of them or I wanted to move it down the widget tree somewhere else and swap it with another one well that would be a lot of cutting and a lot of pasting and a lot of editing and it would be nice if there was a quicker way to do this unfortunately thanks to this Action menu for each different widget there is a quick way to do this so say for example I wanted to swap this container with this container but what I could do is I could just click on this container and then see this little light bulb that is the Action menu for this widget so if I click on this now I can see all of these different actions I can perform for this widget so I could say for example move widgets down so if I do that it's going to move it down underneath the other widget so now it's second over here and likewise I could grab this one click on that the Action menu and then I could go to move widget up like that awesome right so that's a quick little shortcut now say for example I want to add some padding around this one well I could just click on this go to the Action menu and say add padding and now we have padding around this thing over here and it's also applied the padding property for us with some edge insects so I could just change this every one or two I'm gonna save this and now we can see padding around that element the second one right here now if I want to remove the padding I could do I could just go to here and I could scroll down here and say replace widget with its children so that is basically it going to replace whatever this widget is that we're on the should menu for with whatever is child is so let me click on this again replace widget with its children and it now removes that padding that's pretty nice right okay so let me go and add padding to the top one over here I'm going to add padding and then I'm going to click on the padding again and click on this action menu and then I'm gonna go to wrap with new widget and now its wrapped in a new widget which I can call for example container so now we're wrapping the padding in a container I know that doesn't make much sense I'm just demonstrating what we can do with this action menu here the different chakras that we can take okay let me control Zed a few times just to get rid of that padding and the container so let's see what else we can do I'm going to click on this container again go to the Action menu and now I'm going to send to the widget so if we want to centralize something we can wrap it in a sensor with you and it does exactly the same it puts the container inside the child of this element of this widget rather so let me undo that again and let's have a look at what else we can do I'm gonna now say wrap with a row so now it puts it inside a row and we have children with a list of widgets and inside that we have the container so pretty awesome right these are pretty nice shortcuts for things that we might do quite commonly and they're gonna save us a lot of cutting and pasting and editing and all that just so that's really nice now we can also access these shortcuts from this thing over here the flutter outline so first of all this gives us a nice visual representation of our widget tree because it shows the different widgets that we have and when the nested it means it's a child widget of the parent above it so say for example we want to do something with this column widget over here or this container widget we can just select that and the automatically goes to that in the code so that's nice first of all and then we can right-click and we can do the same kind of thing over here so all of the different things we had over here we can now do over here as well and we also have shortcuts at the top these little buttons that one is for centralizing it put in a - widget around it this one is to add padding this one is to wrap it with a column this one a row and so forth and also move up and down right here okay so I know this was just a short little video but I really wanted to show you these different shortcuts because it's gonna save us a lot of time and I'm gonna be using them in the future as well so I wanted you to be quite familiar with them and not thinking hang on when I use one in the future so now we know how to do that in the next video what I'd like to talk about is expanded widgets which is another layout widget and also the Flex property

# 15 - Flutter Tutorial for Beginners Expanded Widgets
    I'll read the gang so now we've seen containers rows and columns all those ways to layout the content on our screen now I'd like to show you another layout which it's called the expanded widget and again if you are from a web background you're gonna find this a very intuitive because it works a very similar to flexbox so first of all notice that I've got these three containers right here inside a row which is inside the body so I stripped out all of the stuff we did before replaced it with this row and these three containers as the children select a minute this looks like a blank screen because there's nothing inside these containers but what we're gonna do is just give these some padding a color and maybe some text as well so we can see them on the screen so for the first one I'm gonna say it's got a padding and it's gonna be edge insects dots off all the way around then we're gonna have 30 pixels our planning we're also going to give this a color and we'll color this so colors cyan and then finally I'm going to add a child which will be a text widget and inside here we'll just say what so we have one container and if we save we can now see this container right here now what I'm gonna do is in fact grab all of this stuff and just paste it inside the other containers because I'm super lazy and I really don't want to rewrite it out all again so now we can just change the colors so this one I'll change to pink accents and then the bottom one I'll change to amber and then this one I'll change to and this one two three so now we should have three containers now all in a row at the top and they're flush left against the left side of the screen now that what if I want to make these containers take up all the available space available to them so for example I want this whole row width to be shared out between these three containers well what I could do is I could wrap each one of these containers inside and expanded widget so we've seen how we can wrap something in a new widget we can go to the Action menu and then go to rap with new widget and then we're going to call this widget expand it so if we check out this now if we save it notice we still have containers 2 &amp; 3 the same size which is the size of the content inside it but the first container now because it's inside the expanded widget over here it's taking up all the available space left over so that's what an expanded widget does and this is very similar to the default behavior of flexbox in CSS so what if we now just wrap the rest of these with an expanded widget as well well we could do that I'm just going to highlight this one over here and click on this go to wrap with new widget and say expand it and then I'll do exactly the same over here I'm going to click on this and go to wrap with new widget and call it expanded like so okay so now we have these three expanded widgets and if I save notice now they're all taken up an equal space horizontally along the row so it's like we've taken all of the space available and just divided it into three because this three expanded widgets here and we've given each one an equal share of the space so that's really nice that's how expanded widgets work and the really cool thing is that we can add on a property to these expanded widgets called flex and again really like the flex box property in CSS so what I could do is provide a number to this and that number is going to represent the portion of width that we want to associate with this expanded widget now that might sound like gobbledygook at the minute but just watch this example and it will become clay so if I give this a Flex of value of 3 and if I come down here and give this one a flex value of 2 and then come down here and give this one a flex value over 1 then save it watch what happens so this one has a flex value of 3 this of 2 and this is 1 so the high the Flex value first of all the most basic seems to take up and what this number represents is a portion of the width that we want it to take up so if we add all these up we have 3 plus 2 plus 1 which is 6 so what we're essentially saying is okay split up the row into 6 portions of width then I want you to apply three of those portions of width or give three of those which portions to this expanded widget so this takes up three of those little pieces this takes up two and this takes a 1 ok so this basically gets half because 3 is 1/2 of the total which is 6 this gets a third because 2 is a third of 6 and this gets 1/6 does that make sense so they're basically fractions of the whole width that they take up so we can play around with these a little bit you know if I make this something like 6 and then make this 3 and that one now the total is 10 so this top one will now get 6/10 of the width this will get 3/10 and this 1/10 so if I save it then we can see those updated width right there so if I give this all 1 then it's going to go back to the default whether they all get an equal share because they're all the same they all get 1/3 does that make sense now another good use case for expanded widgets is when we're trying to contain images within the boundaries of the screen over here so what we could do for example is come to this row over here this list of children and what I'm going to do is add in an image so we'll just say image assets this was the shortcut remember for adding an asset image and we're going to pass through the path which is in assets and then forward slash and we'll just go with this one space - to JPEG so if I save this now because these images are naturally really large it's going to go off the page if we see it and we don't even see the rest of these expanded widgets because this has pushed them right off the page because it's so large or rather it's not pushed them off the page it's kind of gone over them so we can't see anything else so what we could do is we could wrap this inside and expanded widget so if I hover over here and then go to rap with new widgets and then choose this to be an expanded widget like so then what we could do is save this now and this expanded widget contains that width of the image like this so now it takes up an equal share so we could also override the Flex property of this thing over here let me just scoot this to the next level down and do a flex property on this so I could say this now has a flex of three which means it's going to be three times as wide as these things over here save it and we can see that as well so that's another good use case of expanded widgets to contain child images so there we go my friends that's the expanded widget in a nutshell we're going to use them to expand content to take whatever space is available to them and we might be using these in the future as well as we create our different projects

# 16 - Flutter Tutorial for Beginners Ninja ID Project
    okay they're my friends so I think we've learned enough of the basics of flotter now to put everything together and create our very first mini application so that's what we're going to do in this video we're going to put everything together we've learned to create a very very simple flutter up which is going to be a ninja ID card it's going to show like a thumbnail of an injure the name details maybe a concept button that kind of thing so I want you to close down your current project in Android studio and then reboot Android studio so we can start a new flutter project so click on that then click on flutter application and then choose a name I'm going to call this ninja underscore ID choose where you want to save your project mine's in the apps folder on my D Drive then click Next then we need our company domain again if you don't have one of these just make it up for now use your name comm or something like that it really doesn't matter for now all it's doing is making a unique package name which is not important at the minute only when you're good to deploy your apps so let's finish this for now and this is going to create that dummy flutter project for us okay so the first thing I'm going to do is open up this ninja ID fold it over here then delete the test folder because we don't need that we're not going to be testing this app so let's delete that and then inside mingi I'm gonna delete a lot of this predefined code which is the dummy app so I'm going to get the class my app and scroll down right to the bottom of the page and delete all of that then we're left with this main function and this run app function let's replace this with a material app as our root widget we've done this in the past and then we'll have our home property remember the home property determines what is going to show on the home screen of our app so what we're going to do is create a stateless widget and that is going to return a widget tree which is then going to show on our home screen so let's create that stateless widget first of all just a simple one so I'm going to say st or less which stands for a stateless and then tab to create this and we'll give this a name I'm going to call it ninja card and ultimately this is going to return a widget tree which will then show on the home screen so now we can instantiate this over here by ninja card like so okay so let's just make this a little bit better instead of container will return a scaffold like we did before I remember this allows us to quickly make a layout so for our app things like an app bar and the body all that kind of stuff so we're going to just create an app bar property first of all which will be an app bar widget and inside this widget what we'll do is give this a title and the title will be a text widget in itself and it can say ninja ID card so let's leave it at that for now that's a basic little template sorted I'm gonna save it and then what I'm going to do is come to this device selection and choose to open up our emulator over here so once that's opened what I'm gonna do is just press the play button so run this application over on this device and there we go now we have our base layout sorted for this new floater up so let's now start to customize this a little bit more first of all I want to address this up bar I want to change its color and I also don't like the drop shadow here so let's sort a few things out first of all I'm going to say Center title just to move the title into the center so it's not on the left and I'll set this to true and if I save that we can see this zoom over okay cool then we'll give this a different background color and I'm going to say colors dots great I want a gray color but I want a deep shade of grey so I'm going to select this then press ctrl Q to see all of the different shades of grey I can use so I'm going to use 854 this up bar and then I'll probably use 900 as a background to the home screen in itself so there's a bit of a difference so over here I'll say in square brackets 850 to give me that strength save that okay looking good and lastly I want to take away this drop shadow you might not be able to see it from there but there is a little shadow giving it some depth and the way we take that away is by using the elevation property and setting that to zero and that's going to make it more flat on the screen which is the design I want so now that drop shadow is gone awesome so now let's move on I'm going to give this a background call over here instead of it being white so let's go to the scaffold in itself and give this a background color property and this will be colors gray and then it's going to be 900 which is a bit deeper than the app bar in itself so let's save that and now we have a little contrast between those two things okay cool so the next thing to do is the body property down here so let's do that the body and this is going to be a column but before we do the column I think what I'd like to do is some padding around that column so that the contents and not up against the very edges of the screen so let me do now a padding widgets we've seen this in the past this just provides some space around a child widget so inside here we need to define this padding so we'll say padding is going to be edged in sets and then we'll do all the way around or in fact no we won't we'll do different values so I'm going to say from and then left top right bottom and we need to passing four values here so 30 for the left I'll do then Fault it from the top so we have a bit more at the top 30 on the right and then zero at the bottom because we don't really need any space at the bottom it's not going to be the full height of this screen okay so that's the padding now we need to place our child inside this padding widget so the child is going to be a column so let's create that column and this is basically going to be the layout of the whole app we're going to have different elements stacked on top of each other inside this column so the first thing we need inside here is a children property which is going to be a list of widgets okay then so what's the first widget I want to do well eventually we're going to show an avatar at the top a little picture of the ninja but for now we'll leave that because we've not covered those yet and we'll do the rest of the content first of all so I'm going to do a text widget first of all and inside this text widget I need to first of all specify what text I want to show and this is going to be named in capitals so it's kind of like a label and then underneath we'll put the actual value of the name now we're also going to do a style property here so this style property is going to be a text style widget we've seen all of this in the past so if you're not following along maybe you should go back and watch some of the previous videos about style and text and columns and all that kind of jazz and then come back here so now inside the textile widget we need to define a color for this and the color of the text is going to be colors dots great just the standard grade that we get with material design and then in fact what we'll do is we'll just preview this for now so I'm gonna save it and we can see name right here so looking okay at the minute but what I'm going to do is just give this some a letter spacing so that the letters are a little further away from each other makes it a little bit more readable when the text is small so I'm going to use a letter spacing property and assign that as two pixels so that means two pixels between each letter so if I save this now you can see we have a bit more breathing room between each letter okay so that's our first text widget inside this column right here so what I'm going to do now is just copy that text widget and paste it below because now I want another text widget and that is going to be the actual value of this the name so let me just scoot this in and this time we'll change the value of name - Shawn - Lee so if I save this now it's going to look pretty much identical to this thing over here now we don't want that instead what we want is a bigger text maybe a yellow text as well something like that so what I'm going to do is change the color of this over here from gray to Amber accent and then I'm also going to give this a different strength 200 so if I save it now that looks like a better color to me for the value so again I'm gonna give this a letter spacing of two we'll keep that I'm gonna change the font size so I'll say font size and for this I'm going to say 28 pixels I'm going to save that's looking better and then finally I'm going to give this a font weight property and for this we use the font weight object and this is going to be bold okay so if I preview now that's looking pretty good now at the minute inside this column these things are quite central to each other so what I want to do is align everything to the left over here so we've seen how to do something like that now remember when we're working with columns the main axis is going down and the cross axis is horizontal what we want to do is address the cross axis because you want to line everything up to the left over here so what we have to do is come to the column over here and we're going to say cross axis alignment then we say cross axis alignment and we're going to use the start property which means align everything to the start over here so if I save that now that looks better okay so we have these two different values here but in de minute they're kind of bunched up together and there's no space between them now I suppose what we could do is apply padding around these things so that there is a bit more space but I want to show you sometimes an easier way of adding space between two elements or two widgets like this and that is by using the size two box widget so what the sized box widget does is just create basically an empty box for us of a height and width that we specify so what I could do is come after the first text widget which is the name and oops then what I could do is use the sized box widget right here and put a comment after that then all I have to do is specify a height property of say 10 pixels and then what this will do is put a 10 pixel box in between these two things now we're not actually going to see the box it's going to have no color it's just going to appear as a space so that's a nice way to add space between two different widgets now I'm going to do the same thing after the next text box down here but this time I'm going to do 30 pixels of height so a bigger space and then I'm going to do another property and another value like this so let me just copy what we've already created because I don't want to write it out all over again and then paste it in here and then I'm just gonna scoot these back in so they are the correct indentation and this time this is gonna say current ninja level all right and then this is gonna be let's crank it up and go with eight so if I save this now we should have two lots of these things now we can see name is generally Kurt ninja level is 8 so we have now a bit of information about the ninja and this is looking pretty good now again after this I want to do a little bit of space so I'm going to do another sized box right here so let me grab that and bring it down here I'm just gonna scoop this in as well and after the text widget over here I'm going to do this sized box and that is going to give us another 30 pixels of space after this 8 before the next thing starts now the next thing I'd like to do is just to create maybe a little icon which is an email icon and then put the email address of this ninja next to the email icon just a bit of contact information or something so since we're gonna have two elements next to each other we're gonna have essentially an icon and then an email address next to it what we should do is create a row that's what we're having write a row of content here two things next to each other so after this sized box I'm now going to create a row like so let's do it not in capitals so row ok so inside this row we first need a children property which is going to be a list of widgets right so inside this list of widget the first thing I'd like to do is an icon widget and this icon is going to be an email icon like a little envelope or something like that so we'll say icons dots and then we'll use the email icon which looks something like this so let's select that and then after that I'm going to give this a color property and I'll say colors gray and then we're going to make this of strength 400 so if I save this now then we should see this little icon right here now next to the icon inside this row I'd like to now place some text so let's say text and then inside here inside this widget we need to specify oops comment not a full stop what's going on all right inside here we need to specify the text itself first of all so I'll make up some kind of email address Shawn dot lay at the net ninja code at UK okay so that's the actual text now I want to style it a little bit so we'll apply a textile widget to this now before I style it let's just have a little look save it yeah it's completely black the minute so we need to change the color and maybe make it a little bit bigger and also give it some letter spacing as well so the color first of all let's make this gray just like the icon so colors gray and then strength of 400 then we'll say the font size is going to be 18 pixels and then final it will say letter spacing and we'll just apply a 1 pixel letter spacing to this so if I say week now it's looking a bit better but it doesn't look great squashed right up to this email icon so much like I've used a sized box right here to give us a little space vertically by using this height property what I could do is also use a sized box to give a space in the horizontal direction by using a width property instead so what I'm gonna do after the icon is use a sized box widget and then this is gonna have a width property and we'll give this a width of 10 pixels so save that and that gives us a little space which looks a lot lot nicer so this is kind of taking shape we have our different properties and values here name Chinle curtain in G level 8 and we now have this icon with a contact email at the bottom now what I'd like to do at the top is now add an image of a ninja in some kind of little circle avatar so what I'm going to do first of all is minimize this I have this folder over here which is all the different assets I'm going to use in the different projects that we create and inside the ninja id-1 I've got this thumb image right here which is chun-li so what I'm going to do is place this inside an assets folder over here so let me create first of all a new directory and I'll call this assets and then let me drag this into that folder okay so remember before we use any kind of images we have to declare them inside this pup spec file down here so let me zoom down to where we use the images here and uncomment that I'm just going to delete the extra space over here before assets and then we only need one image which is in an assets folder oops over here and then it's called thumb and the extension is jpg like so okay so if I save this and cross this off I'm now going to click get dependencies because we changed the pup spec file and now we can minimize this now we can use that image over here now we're going to place it at the top so let's go right to the top of the column where we have our children list over here and it's going to go at the very top of this list now then what widget do we want to use to show this image now I said I wanted this to be some kind of circle avatar so what I'm going to do is use a widget called circle avatar that comes loaded into the flutter framework which is awesome so inside this widget we need to specify a couple of different things first of all the background image that we're going to use for this avatar now we're going to use the asset image widget to do this so the assets image that we're going to use is going to be inside the assets folder forward slash Thorne's a peg like so now if I save this at the minute then we're going to see this at the top over there but it's quite small so we want to make this bigger and to do that we can use a radius property and the radius of a circle is basically half of the diameter of the circle so the bigger the radius the bigger the circle is going to be so I'm gonna make this 40 pixels in size and that's going to make it much bigger this thumbnail or like this okay cool now I would also like to put this into the middle rather than over on the left so what I could do is click over here on the circle avatar go to the Action menu and then Center the widget and that's going to place the center widget around the circle avatar like we've seen in the past so let me save this now and now it goes into the center which looks a bit better now there's one more thing I'd like to do and that's to place some kind of divider between this avatar and the rest of the content so after this Center thing over here I'm going to come down and the next widget inside this row is going to be one called divider now this divider widget is going to take two properties first of all it's going to take a height property which is going to be the space of this divider which is going to be 60 pixels and then secondly a color property which is going to be colors gray and then strength 600 or rather I'll do it a bit darker 800 so a little bit lighter than the background but not much and then we'll save this and now we can see this little line which is this color between the avatar and the rest of the content now you might be thinking this line should be 60 pixels in height but the line itself is not 60 pixels in height the actual height the space around the divider including it is 60 pixels in height so we could even make this a bit more like 90 pixels and that's going to space out some more as well okay then so I think that is pretty much it like I said this is a really really simple app but hopefully it's showing you how you can knock something up pretty quickly like this using all of the stuff we've learned so far and the apps we're going to create in the future are going to be more complex don't worry about that this is just so you can get a bit of practice using the different widgets that we've learnt now if you did find yourself struggling keeping up with the different things I've done here maybe just go back and review some of the older videos before we go ahead because from now on I'm going to be assuming that you're comfortable with all of these different widgets that we've used inside this up in the next video what we're going to do is turn this into a stateful widget and look at how we can use changing data inside this app

# 17 - Flutter Tutorial for Beginners Stateful Widgets
    okay the my friends so far we've only used stateless widgets inside our project which is fine because we've not needed to use any kind of dynamic data or states inside this widget which we change on the page remember a stateless which is one that doesn't really change after it's been created it doesn't contain any kind of state of data that changes over time or in reaction so we use it interacting with it on the screen like clicking a button then changing something but what if we wanted something inside our app to change over time or to display some form of dynamic data for example we could have a button at the bottom which when clicked is going to change this ninja level it might increase it now that would mean that the widget would be changing State over time and for that we need to use a stateful widget because remember a stateful widget is one which can change state over time or it can contain dynamic data which changes so the data that changes over time is going to be stored in what's known as a state object so it's going to contain values which can change such as a number that we output on the screen or maybe a color which changes the background color either way it's gonna change the state of the widget right so when the state changes it means that obviously something has changed in the widget and therefore the UI over here is going to need to update to reflect that so let's try creating one of these stateful widgets and see what this is all about so what I'm going to do is before I alter any of this code is just a zoom right to the bottom over here and create a stateless widget or rather a stateful widget from scratch and to do that we can use a snippet called st ful and then press tab and that creates as a stateful widget and I'm just going to call this test for now now if we take a look at this it's actually created two classes for us right here the first one is this stateful widget class so this extends stateful widget much like up here this extended stateless widget this one down here extends stateful widget so we're inheriting from this now now inside here we have this function create state which is then returning this or the function now this is instantiating this second class that it creates for us and this is a state object so it's building a state object for this stateful widget which we just created and it's linking this state object to this widget so now inside this state object right here which is just another class we can actually define data and we can change that State over time now also inside this state object we have this build function again and we return a widget so this is the same as up here where we have a build function and we return a widget so when we use this test widget in the future then eventually what's going to happen is it's just going to return this widget tree that we create right here okay so we have the two classes we have the actual widget itself which creates a state object and that state object associated with it can now contain data and returns this widget tree but we can now output that data that we create in this state object inside the widget tree and when that data changes over time if it does then this widget tree is going to update to reflect that change in data so say for example down here we could create an int counter and that could be equal to I don't know 0 or want to begin with and then down here we could output that counter and when it changes it's going to rebuild this widget tree and it's going to update where the counter is updated so to begin with we would be outputting 1 if we output in the widget tree and then if this data changes we rebuild and eat outputs the updated value okay so what we need to do now is figure out a way to turn this thing over here this ninja cab which is currently a stateless widget into a stateful widget so that this data this level over here can be dynamic and we can change it over time so what we could do I suppose is we could take all of this widget tree that we have right here we could you know cut all of this and we could potentially paste it right here like so and now this is a stateful widget and we'd rename this to be ninja card this over here etc but I'm not going to do that instead I'm going to show you a quick way to turn a stateless widget into a stateful one okay so let me just undo all of that we're going to delete these two new stateful widgets that we just created and now I'm going to come to the top oops I've deleted too much there how about so let me undo undo undo so we get that template back now let me delete these new stateful widgets okay so we're back with our stateless widget over here for ninja card I'm going to highlight this and then go to the Action menu and click convert to stateful widgets so that's nice it's taken our widget and it's converted it to a stateful one and now we can see two classes we have class ninja card which extends stateful widget and inside we have to create state function which is returning an instance of this state object right here so inside this state object we now have our build function with all of that widget tree that we defined earlier so it's converted that stateless widget now into a stateful widget so now what we can do is define data in here or state which can change over time now before we do that just a quick thing the way we use this stateful widget is no different than how we would use a stateless widget we still use ninja card like this because that is still the name of this stateful widget it's just that now we have a state object associated with this and we've moved the build function into that state object class instead okay but it's all still linked to this widget at the end of the day this is still the widget we use all right so then in here let us now define some kind of data or state that we want to change over time now I want it to be this thing here so what I'll do is define an integer and I'm going to call this ninja level like so and to begin with I'm going to set this equal to zero now what we want to do is actually output these value as the ninja level over here instead of just outputting eight to begin with so to do that we need to scroll down to where we're actually outputting this number and it is down here where there it is so instead of a we now want to output this variable which is called ninja level now inside a string if we want to output a variable we do that by doing a dollar sign and then the variable name which is ninja level like so okay so if I save this now then to begin with we're gonna get an error because it says ninja card is not a subtype of stateless widget but if I go to the Run panel and then click hard refresh or rather hot restart then we should see that now so whenever we use data if we want to reset that data then we need to press this thing right here to hot restart it and get that fresh data so now we have that output but what we'd like to do is change this over time now I'd like a little button down here to click so that when we click that it changes it now we've seen how to do that in the past it's a floating action button that we can add to our scaffold so if we come to the scaffold over here we can below the app bar just add in a floating action button so floating action button and that is a floating action button widget in itself so we need this unpressed property so that when a user clicks it then something can happen but first of all I'm going to add a child property which is going to be an icon and that icon is going to be an add button so I'll say icons dots add and it gets this little plus button right here so I'm also gonna give this a background color so we'll say background color and that is going to be colors dot gray and it's gonna be of strength 800 so we'll place that in square brackets okay so let me save this first of all and we should see this plus icon now when we click this I'd like to increase the level so we want to edit the value of this so let's do that inside this unpressed function so what do we do to update this and reflect that changing the screen well we don't just set the level as is so if I say something like ninja level plus equals and then one so we're adding one that's what plus equals means it takes the current value and adds one to it if I do that then save it if I press this it's not gonna work so even though we might be changing this it's not rebuilding the widget so what we need to do instead is use a function called set state like so and this takes in as an argument a function in itself so whenever we call set state we increase or we set the state of that widget inside here and what this does when this is called is trigger the build function so then it rebuilt it with the new state so what I'm going to do is say now ninja level plus equals 1 so we're taking the current value of the ninja level and adding 1 to it inside this function inside set state so whenever we want to change the state or the data inside a state for Bridgette what we have to do is use set States inside that we pass a function and inside that function we update the values because this is the only way when we use set state that triggers the build function to rerun and then update wherever we output this thing over here with a new value so if I save this now then you can see it's currently 4 because I press this a few times before and it's just updated on save but now if I click on this plus icon now we can see it updates in every time I click on it ok and that's because now we're using set state to change the actual value and set state is what is triggering this thing to rerun so every time we call this set state it triggers the build to rerun and where the data is different it's going to update that on the screen ok so now we've seen how to create a basic stateful widget and update the state in that widget in the next video what I'd like to do is start a fresh project and talk about lists of data inside flutter apps

# 18 - Flutter Tutorial for Beginners Lists of Data
    all right gang so I want to move on now and talk about something else in flutter and that's how to cycle through lists of data and output that list of data in a widget dynamically so to do this I've created a new project a new blank project because what I want to do doesn't really fit with that ninja id-card project we were creating so I've created a new project and I've called this quotes and what I've done is deleted a lot of the bump that comes along for the ride when you create a new project on the boilerplate code and I've also deleted my app from inside run app as well now what I'm also going to do is remove the test folder because we don't need this anymore and the reason they keep deleting this by the way is because if I don't if we take a look inside here it references my up and it's just gonna cause a squiggly line and an error so I just like to get rid of that so we don't get that error so let me delete it like so okay so now what we need to do in here is build up this new application and it's going to start with a material app like we always do and inside this we need a home property now remember we need to make a widget now which is going to be instantiated here so that the home screen is going to be represented by the widget tree inside that widget now this is going to be a stateful widget because we need some changing data inside this widget we're going to have a list of data we cycle through ultimately and it's going to output to the screen so data could be changing here in there so let me now create a stateful widget so st fu l and tap and we're going to call this quote list okay so now we have our stateful widget class over here called quote list and it's associated a state object with it right here in this function which is down here and remember we have to build function inside the state object and this is where we return the widget tree so let's just reference this quote list stateful widget right here by saying quote list and now if we save this and play this then we should see a preview of this over in the device preview ok then so we have this preview now which is just a screen of doom at the met hit so let's build this up into something more interesting I'm gonna remove the container right here and I'm gonna replace that with a scaffold widget instead let me just get rid of that okay so inside this scaffold widget we're gonna have an app bar but before we do that let me give this a different background color and this is gonna be a gray color but a light gray this time so I'll say gray and then 200 it's more of an off-white so if I save that now we should get that gray color okay now we'll do an up bar and this is going to be an app bar widget you should be used to doing all this by now because we've done it in three different projects I think so far so let's now open this up and do a title which will be a text widget and the text will be awesome quotes okay so after the title we also want to censor the title so let's pop in that property and set it to true and then finally let's give this a background color and set it to colors dots red accents will go with that okay so if we save this now we should see this at the top this up bar and now we can add in the body of the app so let's put a comment after app bar and come down and say body this time and the body this time is gonna be a column because we're going to basically cycle through some data later on and we're going to output a separate little widget in a column for each bit of data so let's do this column and right here we need a children property which is a list of widgets right it's just a list now before we start outputting anything let's create this data so what I'm going to do inside this state object because that's where we define the data remember is create a list now the type of data I want in the list are going to be strings so let's do our angle brackets and say string and then we need to give this a name this variable so I'm going to call it quotes and set it equal to a new list now inside here I'm just going to do a lot of different strings well three strings to be exact so three quotes and instead of me type them out and you watch I'm just going to copy them from my repo and paste them right here so three quotes bonus points if you know who these quotes are by and what we're going to do now is cycle through these quotes and we're going to output a text widget for each one so how are we going to do this how we're going to output each of these quotes well there's a few different ways we could do this we could just hard code them but if we were to hard code them by actually writing the widget for each one then we're just hard coding the data and fair enough there's only three a minute but in the future there might be 10 and in that case we'd have to hard code 10 text widgets in the future there might be 50 and we'd have to hard code 50 texts which hits and that's not always the best way to do it so that's one option anyway another option is to use a list view widget built into flutter and we're going to learn about that later but the way I'm going to show you is to use the map function to map through our list of data and to output a small template or a small widget for each one okay so how does this work exactly well instead of defining our list right here what I'm going to do instead is say okay well take the quotes right here which we have and then use the map function on the quotes now what does the map function do it's pretty similar to the map function in JavaScript it cycles through a list of data so it's going to cycle through this list of data and for each item in that list it's going to perform a function and then we can return a value for each one of those functions so let me just explain this as I type it what I'm going to do is create a function right here and this function is going to execute for each item in this list and we get access to that item and we can pass it in here as a parameter so we can call it a or Q for quotes I'm just going to call it quotes like that so every time we cycle through a different item inside this list we get access inside this function to that quote okay so what we could do is we could say okay well that quote I want to take it and output it so I'm going to return right here a text widget and in that quote so what we're now doing is saying okay well cycle through this and perform a function for each item and for each item take that quote that string and return a text widget and that's returning that into this iterable quotes dot map returns an iterable so what we need to do is actually return a list because remember the children property expects a list so if we say at the end of this dots two lists which is a method we can use to turn it into a list then now we have a list of text widgets and each text widget is taken in the quote each time around it cycles okay so this should work now if we save this and preview over here we can see we're taking each quotes as we go through it and we're outputting it to the screen so that's working awesome now this is absolutely fine but remember we can use an arrow function if we're just returning a single value here on one line so what we could do is just remove this return keyword and we can move this up here we don't need the curly braces anymore either so we can take those away and what we can do is just do an arrow from the parentheses and then that's going to return text with the quote inside that widget and then we're turning this to a list at the end of it so that's all we're doing here we're mapping through a list of quotes we're taking the quote for each function or for the function that fires for each item in the list rather and then for each item in the list we're returning a text widget and the text of that widget is going to be that quote that we're currently cycling through eventually this returns an iterable which should not be the value of the children we need a list so we take that iterable and we use the two list method and that turns it into a list of text widgets okay so if I save this now it's still going to do exactly the same it still outputs all of those different quotes now it may be that each quote also has an author associated with it so each bit of data over here in the list is going to have to be a little bit more complex and we're going to look at how to combat that in the next do

# 19 - Flutter Tutorial for Beginners Custom Classes
    so that at the minute we have a list of quotes right and without putting each quotes now at the minute each quote is just a single string but what I'd like to do is associate an author with each one so how are we going to do that well I suppose what we could do is we could create a new separate list and you know this would be strings as well and then this could be called authors and then that could be equal to a new list and then with placing the author each time around for each item in here now we could do that but this isn't good for two reasons first of all it could get quite messy because we'd have to make sure that the index of each author is the same as the index of the quote for that author in this list as well they'd have to match up and it also means you've got two sets of data for what is essentially one thing a quotes and that makes no sense whatsoever so let's delete that let's throw that idea in the bin and think of something else because instead it would be nice to have a list of maybe quotes objects inside here instead and each object would have the quote text property and the quote author property now for this we're going to need to make our own quote class so what I'm going to do first of all is in the lib folder is create a new dart file so go to new and then dart file and then we'll call this quote and inside here we'll create a quote class so we've seen how to do this in the dart primer if you've not watched that maybe check out that video first of all but it is quite simple we'll create a class called quotes and inside we need two properties we need a property for the text and a property for the author remember a class is basically a blueprint for an object type or a type of data it's going to describe what properties of functions that data house so classes are a way to describe and create new object which is going to help us because we're going to make quote objects right so these quote subjects they're going to have a text property and an author property so let's create these string text and remember we don't define the actual value for this we don't set it equal to whatever the text of the quote is going to be because we want to define that as we create a new quote object so that's the first property and that is going to be the actual quote it's the text of the quote and the other property is going to be an author which is also going to be a string so let's do another one of those string author now just quickly another reason that classes are good for things like this is that it starts to be modular eyes your code and you start to implement some abstraction and separation of concerns into your code as well which is always good especially as your code base gets bigger it separates things off into its own logical sections so anyway we have this class now we also need a constructor because the constructor is the thing that actually takes values in when we instantiate a class and it sets the values the text in the author so let's do that the constructor is the same name as the class so quotes and it's going to take in two parameters so the string which is the text and also a string which is author let me just add the Gion so it's string text and also a string author so it's taken in those two things right so inside here what we need to do is say okay well this dot text so this property right here is going to be equal to the text value that we take in so set it equal to that and then this dot author is going to be equal to the author down here all right so that's pretty simple isn't it now if we wanted to create a new quote then we just say something like this in the future we'd say quote and then we'd pass in the two different parameters which say the text is something like this is the quote text and then we'd passing the author and the author would be I don't know Oscar Wilde okay so if we wanted a new quote that's pretty much what we do and we'd say quote my quote it is equal to this so that's all we're doing we're making a new quote object and we're passing in these two strings these two strings then get taken in to the constructor and we're setting the values of that instance of the quote now just before we go any further what I'd like to do and by the way that should say quote not quite or kite what I'd like to do is talk about different ways we can assign these values and the first thing I'm going to talk about is named parameter so instead of doing this let me just comment this out what we could do is use named parameters and in fact it won't comment this out what I'll do is I'll just edit this so if I add curly braces around these things right here what we're saying now is that these must be named parameters so when we pass them in instead of just passing the actual data in we pass in the values or the names of these data so this one is called test because we set it with call text there so we'd say well this is the text that's the value and then this is the author right here okay so now we're using named parameters and one of the benefits of this is that now we could do any order so if I wanted to put the author first I could do it doesn't matter what order they're passed into the constructor it did before because the first value would be the text and the second value would be the author automatically but now we're using named parameters we're saying explicitly this is going to be the author and this is going to be the text value so that's how to use named parameters and another good advantage of using named parameters is that we can get rid of this right here we don't need this anymore and we don't need the curly braces and instead we can get rid of this we can say this dot text and this dot author so what that is doing is taking in the author right here and it's automatically assigning it to this property and it's taken in the text and it's automatically assigning it to this property so anyway now we have our class let me just delete this down here we don't need this anymore I'm going to save this file and what I'd like to do is use this quote class over in main dot now to use this the first thing I'm going to have to do is import it up at the top so I'm going to say import and then just quote dot dot we don't need to go into any folders it's in the same directory so now we've imported that we can go ahead and use it down here so instead now of just having the actual text the actual quote we can have three quotes objects so I could now say quote then I could do an author and the author would be Oscar Wilde so Oscar Wilde and then we'd also have a text property and the text property it would be the string itself now I'm just going to copy this from my github repo I don't want to be writing this up from scratch and boring you so anyway that's the first quote object now so comma and let's do another two now again I'm just going to copy these from my repo so we don't bore you typing these out from scratch but we have three quotes now and you can see that each one now has an author property and also a text property now we're getting an error at the minute all this is red and underlined and it's saying that element type quote can't be assigned to the list type string and that's because right here when we declare this list were saying that these things are strings no longer are they strings they are quotes so we have to update this to quote like so and then everything is fine now okay so now we have this list of quotes with two properties each now down here we're trying to output the quote but now each quote refers to a quote object so not the text so we're trying to now output a quote object inside a text widget which makes no sense whatsoever so what we need to do instead is output a string here and then we'll output the different properties of the quote object that we get each time we cycle through that list of quotes and we'll output the text first and then the author so we've seen how to output variables inside a string before we use the dollar sign and then whatever the variable name is now what we want to do now is tap in to a property and we want the text property so it's say dot text right but we can't do this if we're outputting a variable which requires a property like this we have to surround this in curly braces so we do a dollar sign then curly braces and then the property on the object that we need so if we're just outputting a single variable if it was just quotes for example we don't need two curly braces but the minute we introduce a dot or some kind of square bracket notation if it's an item in a list then we need these curly braces around so that's the way it works so without putting that first of all then inside the string I'll do a - there won't output another part of the object which is going to be the quote dot author so we're now outputting the quad text - the quote author so if I save this now then we should see this oops it says here string is not a sub type of type quote quote so what I'm going to do is just go to the wrong tab over here and do a hot restart to refresh the data because we changed all the data now and now it works so we can see we now have all of the author names as well as the author text so there we go my friends that's how we can create a custom class to create our different objects inside this list and then we can still cycle through those objects and output different properties of those objects in the text widget

# 20 - Flutter Tutorial for Beginners Cards
    okay then so at the minute what we're doing is cycling through this list of data these three quotes objects and without putting the text property and the author property both inside this single text widget and it looks like this over here a bit cruddy right I like this to look a little bit better so instead of just having a text widget right here that outputs both of these properties it would be nice to output some kind of better template now we're going to be using cards to do this and a card looks something like this where we have this little border around it and it K brings it away from the page a little bit with this box shadow so that's what we're going to be doing something similar to that and the template is going to be a little bit longer than this so what we're gonna do to create this card template for each quotes I'm gonna make a new function up here somewhere in a minute and that function is going to return that card template if you like now we're gonna approach this differently later on and find a better way to generate these card widgets but for now this will do because I don't want to overwhelm you with too much at one time okay so first of all let's go ahead and create this function that's going to return some kind of quotes templates using the card widget so what I'll do is just below this list is I'm going to create a new function and this function has a return type which is going to be a widget so remember we saved the return type first of all then the function name which is going to be quote template and then we're going to take in an individual quotes so basically we're going to call this function for each quote as we map through this list and we're going to pass that quotes into the function and we're going to return a widget tree based on that quote so we can output the data from that quote inside the template so then we need to return right here and what we're going to do is return a card widget we're going to create a card so inside this card the first thing I'm going to do is give it some margin now we can apply a margin property to cards which is good and then I'm going to say edge in sets and this is going to use from L to R B so gonna have a different margin in each different direction now it's gonna be 16 on the left and then it's gonna be 16 at the top it's gonna be 16 to the right and then it's just gonna be 0 at the bottom so we have our margin no and the next thing we need to do inside a card is a child property now what's going to go inside this card well we're gonna have two different things inside this card our way we're gonna have the actual quote itself the text and also we're going to have the author so I want to add two different widgets on top of each other inside this card now to do that we need to do a column right because we've got two widgets stacked one on top of the other so let's create that column first of all inside this column and I'm going to say children and that is a list of widgets now the first thing I'm going to do is a text widget for the quote text so let's do that and inside here I'm just going to say quote dot text now the reason I don't need the dollar sign and the curly braces here is because I'm not actually outputting this in a string I'm just telling the text widget to use this string or right here directly you know if it was inside quotes like this then I would need to output it inside the variable wrapper like this but we're not we're not doing that we're just outputting it directly outside of the quotes so now we can just say look use this string for the text okay all right then so next up we need a style property and that is going to be a text style widget oops let's spell this correctly style is going to be text style like so and the different properties I don't like to control are the font size and the color so let's do the font size first of all we'll set that to 18 pixels and then the color is going to be colors gray and then we'll use a shade of 600 which is quite dark a lot darker than this background okay so that's our first text widget done now after that what I'm going to do is a sighs box widget remember we can use these to give us a little bit of space between two widgets by setting a specified height so I'm going to say sized box and then inside here I'll say the height is going to be about six pixels so not too much just a little bit okay now the next widget we're going to do is another text widget in this column and this time the text is going to be for the author so this time I'll say quote dots author for the text and then we also want a style property and this is going to be a text style widget so in here I want to do the same thing I want to control the font size and also the color so font size first of all is going to be 14 pixels a little bit smaller for the author and then the color is going to be colors dot gray and this is going to be 800 so a little bit darker than the actual text so what I'm going to do now is actually use this function down here inside this template inside this widget tree instead of this function right here so I can delete this thing in here and instead what I'm going to do is call up the quote template function and pass in this quote right here so I'll say quote like so and this is going to do exactly the same thing for each item in the list we're going to map through that cycle through it we're going to fire a function for each one and in that function we take the individual quote then we call this function quote template and passing that quote that returns towards a template this widget tree right here input the card and that is going to get output right here inside this column inside this list because we turn it to a list in the end so if I save this now we should see these in cards instead which we do awesome and that's starting to look a bit better but I want to do a couple of things to make you look even better the first thing I'd like to do is wrap this in a bit of padding because at the minute the card doesn't really have any padding inside it so let me go to the Action menu and go to add padding and then we'll just change this to about 12 pixels and save that and now we can see a bit more room I also want these thing to stretch the whole width over here so what I'm going to do is use the cross axis alignment because remember in a column the main axis goes down the cross axis along I'm going to use the cross axis alignment property to set the alignment to be stretch and that's going to make these things stretch all the way across so inside the column widget we're gonna say cross axis alignment twice and it's going to be the stretch property so if I save this now hopefully this looks a bit better awesome so there we go my friends that's how we can create a function now that is returning a widget or a widget tree and we're using that function right here to generate a template for each item in the list that we map through now the way that we've done this is not the most efficient or best way to generate these card widgets and templates and output them we can do this a better way by extracting this widget up here this card widget or this widget tree into its own stateless widget class and then reuse that widget whenever we need it I didn't want to do that at first because I didn't want to overwhelm you I'm wanting to do this one piece at a time but we will look at how to do that in the next lesson

# 21 - Flutter Tutorial for Beginners Extracting Widgets
    okay then going so far we've seen how to map through our list up here and then for each quote what we're doing is calling the quote template function over here and we're returning a card widget so that for each quote up here we're out putting a card widget to the screen and that's fine but there is a better way to do this which doesn't include creating this function over here and it also helps to modular eyes our code too so we can do this by creating our own custom stateless widget which represents this card template right here now a quick way of doing this of creating this stateless widget for this card template is to go into the flutter outline up here and then select the card that we want which is this thing this is the thing we want to put in its own stateless widget we can right-click this and we can go to extract widget right here so press that and then we need to give this widget a name now I'm going to call it quote card which makes sense right because it's a template for a quote card then click on refactor I'm going to close the flutter outline and notice what happens first of all it's removed all of the return statement here where we returned the card and instead it says return new quote card now down here we actually see that it's put quote card into its own class which extends stateless widget so it's created a new widget called quote card and then down here we have a build method which returns the same card template so basically it's taken that template and it's put it in its own widget so if ever we wanted to use this template in the future we could just use an instance of this quote card class now we also see this constructor right here with the Souper we don't need all of this stuff for now and that's kind of beyond the scope of this tutorial so I'm going to delete this but we do have a problem inside this thing over here we're trying to output the quilt text and also the quotes author now inside this stateless widget we don't actually know what the quote is when we up here create a new instance of the quote card then we're not passing any date into that we're taking a quote into this function quote template but we're not passing any data into the quote card no kind of parameters so what I'm going to do is actually pass that through into the quote card class and then down here we can accept that into a constructor so first of all I'm going to create a variable called quote which is going to be equal to object-- so I'm gonna say quote and then quotes so now we're going to have this local quote variable inside this stateless widget and I want to accept that in when we instantiate a class now we're passing it in here but we're not passing it in as a named parameter so I'll do that now I'll say the quotes property is going to be the quote right here and then down here we'll do our constructor so quote and then we're using named parameters so I can just use curly braces and then say this dot quote so whatever we pass in is going to be assigned now to this value now at the minute we're getting some squiggly lines over here and that's because we're using a stateless widget at the minute but we're trying to use data inside that stateless widget now we can use data inside a stateless widget but it's not allowed to change over time so what we have to do is put a final keyword in front of this right here and then this is saying look this is going to be the final value of this variable so it's not going to change now one more thing we need to do is actually change this to quote card because that's what the class is called and the constructor should be the same as the class so we're receiving this in now and we're storing it inside this local quote variable so now we can use that down here and now we no longer get the squiggly lines where we try to output the author and the text so if we were to save this now it should all work because from the top we're mapping through the data we're firing this function taking the quote we're calling quote template and passing in that variable the quotes an inside quote template we receive that and we're returning a new quote card instance by the we don't need this new keyword anymore the new version of dart doesn't require that so we can take that off and we're calling this to return a new quote card instance and we're passing that in as a name parameter so down here we're receiving that name parameter and assigning it to this value right here this variable so now we have access to that quote inside this stateless widget remember we have to put final in front of that to say this is not going to change over time it allows us to use the data this way now we have that quote we can inside return this card template and in there we can output the information from that quote so essentially we're returning this card for every quote inside the list so this should all work now I'm going to save this and see if this works and we see no change over here and that's a good sign because it shouldn't change over here you know we're not doing anything new over here we're just rewriting our code to be better more efficient and more reusable so now we've done this there's one thing I'd like to do and that is to actually delete this function because it's become a bit redundant why do we need to call this function down here just to return a new instance of the quote card can't we do this directly down there inside the map function so let's instead get rid of this dude and delete this and what I'm going to do is paste this down here so now what we're doing is we're saying okay well still map through the quotes and fire a function for each one then for each quotes I want you to get a new instance of the quote card which is returning this widget tree to us and outputting the quote data so that's going to do exactly the same thing and if I save we can see nothing changes so that's a good sign again this all still works now one more thing that promise because we've externalized all of this template into its old quote card class we've made this a bit more modular and reusable right so we might want to use this in a different file later on now if that's the case what we should do is maybe put this inside its own file so then we can just import this into what the file needs it in the future so let's do that let me now just highlight all of this class and cut it and we'll go to our project files over here and what I'm going to do is right click and go to new and then we'll choose a new doubt file down here and I'm going to call this quote underscore card art so now we have this file I'm going to paste this in and I'm just going to save it now notice we get a lot of these different squiggly lines at the minute and that's because we've not even imported the quotes into this file yet and we've not imported the material library so let's just do that at the top we can just copy this from main darts so let's copy those things and import them here we need to import this because we're using the flutter material package and also we need to import this because we're using the quotes object right here so now we have those imported we don't see any of the errors so let's save this now and the next thing we need to do is import this into our other file so let me go to main darts and now let me import quote underscore card dart like so and now this should work now we've imported it we should be able to use this quote card class so if I save it again again nothing changes over here which is always a good sign I'm even going to do a hot restart just to see if it didn't catch any changes when I saved but still it still works over here so everything still works but now we've made our code much more modular we've created an external template in its own widget and we can use that custom widget whenever we want now in the template

# 22 - Flutter Tutorial for Beginners Functions as Parameters
    okay then so now we have our different quote cards listed here it would be quite nice if we could have like a little Delete icon on each card when if we click on that icon it's going to delete that quote from the data so thereby update the UI so we don't see that so how are we going to do this well first of all let's add on like a little delete icon to each of the cards so we need to consume our quote card file into the card template first of all and then we'll do this at the bottom after the last text so first of all I'm gonna do a sized box just to give me a little bit of space and this is going to have a height of 8 pixels and then after that we'll do a flat button we've seen this in the past and we'll say dot icons have an icon on that button as well so inside here we need first of all an on pressed property which is going to be ultimately a function that deletes our data so when they click on that we're going to delete it and then under that we need also a label property which will be the text so we need a text widget and then that will say delete quote and then finally we need the icon and that will be an icon widget and this is going to be a delete icon so we'll say icons dots delete okay so if we preview this now we should see a little delete quote button on each of these things over here so what I'd like to happen is that when we click on one of these it deletes that quotes so we need to write that functionality into this unpressed property write this function however there's a little problem with this our data doesn't exist inside this stateless widget so from here we can't actually directly modify that data we can't delete it we can only modify that data where the data is defined inside this state object so we could delete it from here but not directly from this function so the way around this is to pass into this class right here a second parameter which will be a delete function so we can define that function over here where we pass it in we're going to pass that parameter in that function and then we can just invoke that function right here so let's try this first of all what I'm going to do is just cut this and then open this up onto a new line then I can paste that in the quotes and what I'd like to do now is use a second parameter and we can call this what we want I'm going to call it delete since that's what we're going to do we're going to delete one of these quotes and this is going to be equal to a function that will pass through to this new quote so inside this delete function all we want to do is set the state right so let's do that we'll say set state and then inside this we need to pass through another function and then in here all we want to do is remove a quote from the quotes list right here now we can do that using the remove method so I'll say quotes which is the list remove and then we need to pass in whatever quote we want to remove so that would be the quote that we receive right here okay so let us now receive this delete parameter inside the constructor so I go over to quote card again and over here I'm gonna say this dot delete now we need to also define that property over here again this is going to be final because it's a stateless widget it's a function because we declare the type first remember and then it's called delete so what we're now doing is actually defining the function over here this is the function that we're passing through as a parameter into this class over here and we're storing it now in this thing so if we now on press of one of these refer to that delete function it's actually going to run this code here in this file where we can't actually alter the data we can use set States to remove a quote does that make sense we're just passing the function through as a parameter so let's now down here say okay well let's call the delete function that's all we're doing so if we save this now and then we try this let's try deleting this middle one and it works they go delete this one it goes delete this one it goes now to see that data again we need to restart the or hot restart rather so I'm gonna click on this and then we get the data back if you want to play around with it again okay so there we go my friends that's how we can pass functions as arguments into other widgets now I think we've gone as far as we can go with this flutter app so I think in the next video what we're going to do is start our next up the Big Ear and that is going to be the world time up

# 23 - Flutter Tutorial for Beginners Starting the World Time App
    okay then gang so I think we know enough about flotter now I've had enough practice with a couple of mini apps to attack the big project over this course and that is the world time app that I showed you at the very beginning of this playlist so close down any other project you've got going in Android studio at the moment and then click on start new flutter project flutter application click next and let's call this world underscore time and then we'll click Next and then give this a company domain then click on finish and it's going to create that boilerplate project for us okay so first things first I'm just going to go into the world time folder and I'm going to delete this test folder in the future I might do a whole series on testing inside flutter widget testing unit testing that kind of thing but for now it's kind of beyond the scope of this tutorial and all of our apps are quite small so we don't need testing too much at the moment so I'm going to delete that so it's not null hey and then inside main dots darts I'm going to delete all of the bumps that we get here all of the boilerplate code except for this bit at the top and then right here we'll use a material app instead and inside this material app ultimately we need a home property which is going to be some kind of widget that's going to show on the home screen now before we fill this in what I'd like to do is create a couple of different boilerplate widgets that are going to represent different screens in actual fact three because we're going to have three screens on this application in the past we've only ever used one which is on the home screen but in this one we're going to have a home screen which is the place that actually shows the time we're also going to have a loading screen while we get the data initially and we're also going to have a screen where a user can update the location and choose different place to find out the time so we need those three different pages or screens and what I'm going to do is go into the Lib folder and I'm going to create a new folder over here now you might not see the new directory or new folder option but you can go to new package as well that's basically just like a folder and we're going to call this pages and press ok so inside this folder we now need to make our dark files for the different pages and the reason I'm doing this is just so we don't have everything sitting directly inside live we just started to organize things a little better now because the apps getting a little larger so let me right click over here create some new files I'm gonna go to new doubt file and first of all we need the whole dart file and then if we expand this we can see that home file then I'm going to right click and I'm gonna go to new and new doubt file again this time I'm going to call it choose underscore location so this will be the widget in here that we have for the choose location screen and then finally we need one more so new again and then dart file and this is going to be called loading dots darts and that will be the initial loading screen when we first fire up the app it's going to show like a little spinner or something what are the data first loads and then when it does load it redirects to the home screen so what we need to do is just build up a few of these different widgets just the bare bones of them so what I'm going to do is copy this thing over here because we need the material dart library and I'm going to paste it in each of these first of all now I'm going to create a widget for the home screen a widget for the choose location screen and a widget for the loading screen so what I'll do for the home screen first of all is create a stateful widget because ultimately in the home screen we are going to be using state so I'm gonna say st and then ful and I'm gonna call this home so that creates us the stateful widget and it links a state object with that widget right here so inside the state object we had to build function where we return the widget to tree now at the minute this is just a container but ultimately we're going to return a scaffold here and inside the scaffold I'm gonna do a body property and for now what I'll do is just a text property as well that says home screen ok so if I now go to main darts and then say ok I want this now to be the whole widget that we just created over here then it's not going to work because it doesn't know what home is we need to import this file over here into this file so we can use it now to do that we could use a relative path so we could go into the pages folder and then get this home file right here and I'll show you that I could say imports and then it would be pages and then forward slash whole oops not in capitals whole darts and this would work you can see we no longer get the error now and if I was to save this I'm going to choose a device and then I'm going to preview this once the device loads so let's move this way over here and then let's preview this project so far ok and you can see that this all works we can see this home widget right here however what I'm going to do is show you a different way to import things like this and that is following a similar convention to this where we actually import some kind of package so what I'm going to do is replace this import over here with something else and that is going to be a package and then I'm going to do a colon and then it's the world time folder over here we can see that that's what we're going into then /pages then /home so now we're using this package import we don't actually have to specify the lib folder over here it knows to go into that then we're saying inside the pages folder then home dot darts so now if I save this it's gonna work exactly the same way and now what I'd like to do is just move this a bit down because currently this bar at the top that shows the time and the battery and things like that that is hiding where it says home screen so it's not really safe to put text up here right so what we could do is use a widget it's called safe area to move this down a bit now in the past we've not used this because we've always had an app bar at the top and that app bar kind of pushes the content down so we've not needed to use this safe area widget but now we're not using an app bar on the home page what I'd like to do is use that safe area widget so what I'll do is come to this text widget and I'm going to go to the action down and then rap with new widgets and this is going to be a safe area widget like so okay so now if we save this we can see that it brings it down into the safe area and that's what this widget does it moves the child of that widget down into a safe area on the screen where we can't actually see it not behind this little bar at the top okay so now we have this basic home screen let's move our attention to viewlets so in here we need to create a widget for choose location and again this is going to be a stateful widget in here because we're going to use data in the future to show these different locations so let's use the stateful snippet and we'll call this choose location like so okay so inside here we're just returning a container at the minute but instead let us return a scaffold as well and then inside that we need a body and then I'm just going to make this a text widget for now we don't need the safe area widgets in this screen because we ultimately going to be using an app bar at the top so it's going to bring the content down automatically but for now let's just add this text to say what screen this actually is so I'll say choose location screen and then we'll go to the next one which is the loading widget and this is going to be a stateful widget as well because we will be using changing state and data inside this widget in the future as well so let's create one last one stateful widget and we'll call this loading and then inside over here we're just returning a container at the minute instead let's return the scaffold again and inside the scaffold we'll do a body property and again this is just going to be a text widget for now to say loading screen okay so now we have all of our different pages set up we can just quickly test them by go to main dart and adding those widgets here and importing them here if we want to I'm not going to do that because it means we have to start messing around with the imports I think just trust me for now that we've created these widgets you can see there's nothing complex about them and they're ready and set up so that we can now navigate to them in the future when we need to so now we've got these basic different widgets set up in the next video what I'm going to show you is the basics of routing or routing in flutter apps and to do that we're also going to have to understand what maps are in Dart so we'll tackle that in the next video

# 24 - Flutter Tutorial for Beginners Maps & Routing
    okay they're my friends so we've got to the point now where we have three different screens on our flutter app and we need a way to navigate between those different screens right now to do that we're gonna have to tackle routing our routing should I say because I am British after all in a flutter and by the way you are going to notice we say routing or out rather than routes or routing and British and I should say the latter but because I've seen or rather heard some of the Americans talk about routes and routing over the years it's second nature to me now I just say routes so I apologise if that offends you if you are British and you're watching this it's not my intention but anyway let's cover these maps first of all because we need these maps to understand routing in flutter ups so then maps in darts are a bit like object literals in JavaScript or dictionaries in Python they're basically just a set of key and value pairs so what we're going to do is create a simple map here to see how we set them up and use them and then we're going to take what we learn and apply them to create some routes inside our flutter app so then let's create this map we do that first of all by saying map that is the data type then it would give this variable a name which I'm going to call student so we're going to describe a student here with the different properties they might have and we start a map by using curly braces like this which looks a lot like we would in JavaScript right to create an object literal so inside we give this different properties and then values to those properties so the property is going to be a string and the first one in this case is going to be a name then we have a colon then the value which is also going to be a string in this case Sean Lee okay so then we can add a second property by adding a comma and then the name of that property which could be the H and then a colon and the value which is this time going to be an integer 25 so now we have this map set up which describes this student it has two properties and values to those properties as well a string and an integer now if we wanted to at some point we could extract one of these values by using square bracket notation and by that I mean we can do something like this I'm going to say print and then inside this print statement I'm going to say I want the student which is the name the map itself the variable and then using square brackets I pass in the key that I want the value to so if I want to grab the name and just pass in name like so and it's going to print the name over here we can see chun-li and if I want the age I could grab the age if I run that we can see now the age hopefully okay so this is pretty much how a routing is going to work we're going to have some kind of route and then whatever widget we want to load up for that route using a map so let's put what we've learnt here to use and create those routes in our flutter up okay then going so now we know a little bit more about maps let's try putting that knowledge to good use by creating some routes for this app now we can create all of the routes on this material app widget directly and we do that by creating a route property and this is going to be a map so this map remember expects key value pairs now the keys in this routes map are going to be the actual routes themselves for example something like forward slash about a forward slash contact and if we went to forward slash contact for example we don't expect to see a contact widget on the screen right so that's how this all works now what I'm going to do is just start with the base ramp which is just forward slash so the first widget I want to show up when we first open the app this is the base routes now the value to these different routes are going to be functions and these functions take in the context object as an argument now this context object basically keeps track of where in the widget tree that we are so we're passing this current context which describes wearing the tree this currently is into these functions and you're going to see this quite a lot in flutter just so that widgets know where they are in the tree in the whole grand scheme of things so anyway this function right here it returns a widget that we want to load up when we go to this base route when we first open the app now I want to load up the loading widget now you might be thinking I've gone crazy because I've said over here that the homescreen should be the home widget and right here I'm saying well the first screen the hope should be the loading widget now ultimately when we finish the app this will be correct this loading screen because when we first open the app we have to load the data first of all so we're going to show that loading screen I'm just specifying this for now so that we can test this out easily the home page okay so we're going to change this in a minute anyway that's the first route the second one is going to be forward slash home and that is going to load up the home screen so we'll say function take the context object and then return the home widget okay and then finally we need a screen for the choose location right here I'm going to call this forward slash location and then this will be a function that takes in the context object and we return the choose location widget okay now currently we have errors on this and this and that's because we need to import them at the top so I'm going to copy this dude well be in Port Hope and paste it twice I'll change this one to loading and I'm going to change this one to choose underscore location so now we've imported all three files and we can use these things okay then so at the minute if we tried to run this then we're going to get some kind of error because this right here is conflicting with this right here we're saying the home screen the first screen should be the home widget and right here we're saying the default base route should be the loading widget so they're conflicting with each other and if I save this now and come to run and hot restart then we're going to see over here that we get an error and that's because of these two things conflicts in so I'm going to delete this right now and then save it and then what I'm going to do is come to run again and hot restart and we should now see the loading screen behind there okay so this is the first thing that's loading up now for testing purposes I want this to be the first screen that loads up so instead of using the home property right here to do that because that conflicts instead what I'm going to do is use a property called initial routes and right here we can say which of these is going to be the first route to load up when we open the app by default it's this one but we can override that right here so I'm gonna choose this whole route to load up first of all and if I save this now and then hot restart then we should see the homescreen now load up first later on when we're done the initial route is going to be this but for now what I would create in the homescreen will go with this one so now we have all of our different route setup we now need a way for a user to navigate between these routes on the screen so for example we could have a button which when a user clicks it pushes us to a different route and that's what we're gonna do we're gonna go to the home screen and a button inside this so when we click on that it pushes us to the choose location routes so let's now insert the safe area remove the text as the child and this time the child is going to be a column widget because ultimately on this page we're going to have a column of different widgets so we need a children property which is a list of widgets and the first one and only one for now is going to be a flat button dot icon now inside here we need a few different properties first of all we need the on pressed property which is a function and ultimately inside this function is where we're going to be navigating them to a different screen we'll come back to that in a second for now let's do the icon and this is going to be an icon widget and the icon we're going to use is on the icons object and it's called edit location okay now we also need a label property which is the text on this button and that is going to be a text widget which will say edit location all right so if we preview this it looks something like this on the screen but at the minute if we click on it nothing happens this is where we want to push to another route and we do that inside this on pressed function so in here we can push to another out by saying navigator and then dots push named so this is a function right here and it's named because we're going to supply a named round we're going to use the name of one of the routes to to that router and then it's called push because essentially what we do is push another screen on top of this screen this screen is still going to exist underneath it's just that we're pushing another one on top of it so this function takes two arguments the first one is the context object the second one is the named route and we want to go to location okay so now if I save this and click on this it's going to push the location screen on top now the home screen is still sitting underneath and we need a way to get back to that home screen once we've come to this page so let's go to the choose location and do this so now inside the scaffold all I want to do is add first of all a background color and that is going to be colors gray and it's going to be 200 and then I also want to add in an app bar which is going to be an app bar widget now the reason I'm doing this is because in flutter when we have an app bar automatically it places a little back arrow inside the app bar when we've come from a different screen and we're going to see that in a second so inside this up bar first of all I want to give this a background color which is going to be colors blue and then 900 so quite a deep blue and then we need a title which is going to be a text widget and that is going to say choose a location and then we also want a censor title property and that is going to be set to true to put the title in the middle and then finally elevation I'm going to take the elevation away remove the drop shadow by saying zero and that makes it flat on the page so if I save this now we can see this thing this arrow automatically appears to take us back to the home page so when we click on this it pushes the new screen on top of the old screen but the home screen is still there underneath this and then when we click this arrow it pops this screen back off and shows what's underneath again which is the home screen so this all works now and this is how we can transition between routes or screens okay so I'd like to talk about one more thing before we finish up with this video and that is this whole concept of pushing and popping routes or screens because it's a really important one to understand especially when you start to make ups with multiple different ramps so you can think of our app as like a stack of screens that show and initially we just have one screen that shows the initial route when the app first opens up then when we use that method to push on a new route what we did is push on a new screen on top of the old screen and the old screen still sits here underneath now in the app bar we had that back button and when we press that what happens is it pops this route back off the stack so we're left with the old route underneath which we then see again so this is all ok but imagine if we're going from one route to another and we're using that method to push new routes on all the time eventually we're going to end up with a tall stack of routes sitting on top of each other and this can become quite tricky at one point to manage your routes when you have all of these different routes on the stack because imagine we want to go back to the home page then it probably wouldn't be a good idea just to push on the home page again because we already have that home screen sitting at the bottom so it is an important concept to understand and we are going to be doing more routing as we go through the rest of this course so that we can see different ways to push and pop routes on and off this kind of stack and manage our routes in an efficient way so I just wanted you to understand that this concept of pushing routes and popping routes on and off the stack

# 25 - Flutter Tutorial for Beginners Widget Lifecycle
    okay gang so in this video I'd like to talk about widget life cycles and a couple of the different life cycle methods that we can tap into so so far in this playlist we've seen two types of widget a stateless one and a stateful one now a stateless widget that cannot have state that changes over time none of the data changes inside that and also the build function only runs once inside that widget when it's created so if we were to try and change something over time that's not going to be updated in the screen to reflect that because it's completely stateless once it's built it doesn't then rebuild itself when things change if we wanted something to update in a stateless widget what we'd have to do is destroy the widget completely and then create a new instance of it with some different data so that's a stateless widget pretty simple now a stateful widget that can have state which changes over time so for example say we had some kind of counter widget and that counter variable inside it changed over time now to change that what we do is call the set state method and when we change the data inside that method that triggers the build function to rebuild that widget so that we see that updated on the screen now stateful widgets also have a couple of different life cycle methods that we can tap into so I'm just going to show you a couple of those now we first have the init state method and that is the first method to be called once our state object has been created now this method is only called once when the widget is first created and it's probably a good place to subscribe to streams or any kind of object that's going to change our widget data in the future now after that we have the build function and this actually builds the widget tree and it runs quite a lot in a stateless widget because it's triggered every time we use set States so we use set state to change the data and that reach rigours the build function to rebuild the widget tree so that we see that change on at the screen and then finally we have this dispose method which is triggered when the widget or the state object is completely moved now we'll eventually be creating a widget which updates weather data so we're going to be tapping into the in its state lifecycle method to set up that data but for now what I want to do is show you a simple example to demo this lifecycle method okay then so what I'd like to do now is tap into one of these lifecycle methods and just demo how this works just a quick example so I've gone to the choose location page and I'm going to come to this state object and enter down here a couple of times and then I want to tap into the init state function remember that was the function that runs first when the state object is first created so I'm going to say oops not in capitals in it and then I'm going to tap to select this suggestion and you can see we have this init state function and it's also an override function meaning that we're overriding the original init state function that we inherit from this state class so we're overriding it and inside we have two different things first of all we have this to do that's just an Android studio feature we can add to do this way quite nice and we have to do is by doing a double /then caps to do and a colon then whatever there to do is and then little reminders of things you need to do inside the app but maybe you're not going to do them just yet and they actually show up down here if you click on to do we can see we have a couple of to do's we have one inside pages and then choose location which is this file and this thing over here so that's a nice little feature but well we do not need that so I'm going to delete it the other thing we see is super dots in its state and that is basically saying okay run the original function that we're actually overriding we use super to do that dot unit state so whatever function we actually inherit for in its state we're on that first inside here then we can do our extra code inside this version of the function as well so what I'm going to do is just a quick print statement to say in it state function ran just so we can see down here in the console when this actually ran so I've done that there I'm also going to copy that and paste this inside the build method so we should see both of these run when we load up this page because remember this fires once when we first load up the widget of the state object and then this fires every time we need to build up the widget tree which we need to to begin with so let's save this now and what I'm going to do is move this up so we can see a bit more then I'm going to go to the choose location page by clicking on this button now we can see in its state function run first of all and then in its state function run again that's because we've not changed this to build I'm actually going to change that to build and save it and then I'm going to go back over here and click Edit location again and we should see this time in its state function R and then build function run okay cool so every time we actually go to that page these things are going to run because when we go away from it we're taking the widget off and we're getting rid of the state object when we go to it again we're creating it again so this runs to begin with and this runs to begin with to build up the widget tree so that happens every time we go to that screen so next what I'd like to do is add a little bit of state to this state object right here and then change it so that we can see that every time we call set state and we change that state we trigger this build function to rebuild so what I'm going to do is just create an integer called counter and set it equal to zero to begin with now down in the actual template I'd like to just add a button and we'll do that inside the body so let me get rid of this text and instead it will just do a raised button and inside that we need the unpressed property which is a function and inside this function we're going to call set oops like that so set state and inside that we need to pass a function and that function will actually change at the counter so I'll say counter plus equals want to add one to the current value and then after we've set the state we should see this print again because the date is going to change and that triggers a rebuild so what I'm going to do now is actually add some text to this raised button so to do that we need to say child and that's going to be a text widget and what I'm going to do is actually output the counter so I could do this in a string by doing a string and then dollar sign and then the counter variable and before that I'm going to say counter is and then we output the number so let's try this now I'm going to save it and we can see counter is zero to begin with but I'm gonna go away from the page first of all I'm going to zoom this up if I can't where is it run and so we can see these different print statements let's go to the page first of all click it and we see this runs wants to begin with and then the build fixture runs wants to begin with now when we click this button and we use set state that should trigger the build function to rerun and then print this again so let's see and we can see we get the build for sure run every time we click on this button so we're re running this function every time we use set state like this and that's how the data gets updated on the actual screen but notice this isn't running again that only runs once at the very start when we create the state object and only this reruns as we change the state so there we've got my friends that is a little introduction to widget lifecycles and we're going to be using this init state function later on to get data from a third party API

# 26 - Flutter Tutorial for Beginners Asynchronous Code
    okay let my friends so hopefully if you're taking this course you already know a little bit about asynchronous code you might be from a JavaScript background for example and you could be used to working with things like promises async and await an asynchronous code in flutter is very very similar remember asynchronous code represents an action that starts now and finishes sometime in the future an example of this could be interacting with an API endpoint or a database or something to get some data so we start the request but it doesn't finish straight away because it might take a second or two to complete that request to go out and get the data so if finishes so time after the initial request is made once we get that data back in the meantime our code should not stop until that request is complete and the data comes back asynchronous code should be non-blocking so that while the request is being made the rest of the code in our file could carry on so to handle asynchronous code in flutter we're going to use a combination of asynchronous functions the awake keyword and something called futures now async in a way a very similar to async await in JavaScript we're going to see that in a minute and futures are a type of data very similar to promises in JavaScript so if you know all about those then this is going to be a breeze for you so then let's do a little example of asynchronous code in action so what I'm going to do is create a function which will return nothing so it will be a void function this function will be called get data and this function inside here would be responsible for some asynchronous code like getting some data now we're not going to use a third party API or some kind of database to actually get real data at the minute for now what I'm going to do is simulate requests by using some kind of delays because at the end of the day it's gonna take maybe two seconds to get some data from a server somewhere we're just gonna simulate that time it's gonna take by using a delay and we can't create a delay inside the dart language so let's just do a little comment down here to say we're going to simulate a network request for a username from some kind of database or something so to do that we'll come down here and we'll future dot delayed which is a function and this is basically going to say okay use the future object and we'll see more about futures shortly but we're going to use a method on that object called delayed and this is going to trigger some kind of delay now this takes two arguments the first argument is going to be a duration and for that we use a duration object and inside here we can specify how many seconds we want this delay to be for so I'll just say three for example and then second argument is going to be a function which fires once those three seconds are up so this duration object like I said is just going to give us three seconds basically it's a built in class in dart that allows us to specify a specific duration we're passing that duration to this delayed method right here and therefore it's going to wait for three seconds and then fire this callback function it's a bit like set timeouts in JavaScript so what we're going to do in here is just then print the name that we get back let's just say it was yoshi so now we have this function what we could do down here is call this function inside init state so when this state object is first created then it's going to run in its state which is going to call this get data method and then it's going to do this little delay right here which is simulating a network request right it's going to take three seconds to do and then finally we're going to print this so let me now call this get data from in its state now we need open this road panel so we can see this down here and I'm gonna save and what I'll do is go back to the home page first of all then I'll go to edit location again so that we first make up the widget and this is going to run so edit location if we wait three seconds now then we should see Yoshi cool so this works right so nothing special about this at the minute we're just kind of simulating a request but the cool thing is this is non blocking code so say for example I add a print statement down here and I just print out something like I don't know statement it doesn't really matter and then save it what I'm going to do is go back to this page over here and open up this console again then go back to this edit location widget you can see statement gets printed first so even though this comes after this we're not waiting for this to finish until the code can carry on the code carries on even though this duration has not finished and this is exactly how an asynchronous request to going at some date would work we'd start that request but it's not going to block the code it's not going to wait until that request comes back to then print out this statement however sometimes we need it to wait for example say we make this Network request for a username and we get back the username which is your she then we want to make a second request and that second request needs this value so in the API endpoint that we use for the second request member to get a biography for that user we need to use this value we get back so we can't make the second request before the first request has finished so we do need to wait now if we were to copy this and paste it down here let me just put a comment at the top of this one so I'm gonna say simulate Network request to get bio of the username okay so we need two username to get the biography we might pass it into the API endpoint or something like that now if we print down here vegan musician and egg collector that would be the biography right so what I could do is save this and go back over here and click Edit location and let's just change this one to two in fact and save it again so it's not quite as long this one takes two seconds this takes three let's go to edit location notice we get statement first because it's non-blocking then we get this vegan musician and egg collector and their final it would get yoshi so if this depends on this then this kind of code won't work because we're still starting this before this is even complete so how do we combat this how do we make this a little more synchronous so we have to do this and wait for this to complete before we start this next line well we'd use a come nation of an asynchronous function so we'd say up here this is an async function and we do that after the parenthesis and before the curly brace so we're now saying look this is going to be an asynchronous function with asynchronous code inside it and then we also use the await keyword which would be this thing right here so now we're saying okay right here I want you to wait right here until this is done to start the next line now what I could do is save this and if we open up the run again then if we go to this and it location again notice now that we have to wait until this first one is done we get Yoshi first of all then we get statement because obviously the code carries on and this is non blocking it takes two seconds so it carries ons here but then after two seconds we get this at the bottom as well so now we are waiting now what if at the bottom we want to wait for this one as well so say we want to output the name that we get back and also the bio at the bottom well we could then place the await keyword right here now the good thing about this a weight keyword is that we can actually assign a value to it so say for example when we make this request is some kind of API endpoint ultimately it's going to return a string value to us we can simulate that by returning instead of printing here and I'm going to return Yoshi so we return this value now now what we could do is say okay well now we'll store that value in a string variable and I'll call this username and set it equal to this so now we're simulating this request right here let me just move this down and move this in so we have more room we're simulating this request to get the username and then it's returning this username which is a string now imagine this was an API endpoint which returns this and it takes three seconds it's the same kind of thing we're saying here right I want you to wait for this to finish before you move on so don't go any further than this once you have that value then carry on and assign it to this variable so now Yoshi will be stored inside this variable and the code will continue and we can do something similar here we can say string and we'll call this something like bio and set that equal to this and then we'll go out and we'll make this request right here we need to return this instead of printing it like so and this request will take two seconds we're going to wait for it to complete when it returns a value then we assign that value to bio and we carry on and down here we could output the username now and the bio so I could say the username - and the bio like so okay so let's try this out now I'm gonna save it I'm going to open up this tab over here and then go back and then I'm gonna click Edit location again so click that and we should wait for the first one first of all Yoshi then wait for the second one which takes two seconds and then finally just print out this at the bottom this is the only time we're printing them so now we are waiting for each request to complete before we move on and this is really good when one request depends on another if they didn't depend on each other we wouldn't need to do this but since this one would depend on this then we can use a weight to do that and since at the bottom we need to wait until both of these values are returned then we can await this one as well now the really good thing is that because we've said this is asynchronous over here then this is not going to block any other code inside our file over here so say for example we get data which is an asynchronous function and underneath that we want to say print and then we'll just say something like hey there and save it so when this runs it's not going to wait for this to complete before this runs because it's outside the scope of this asynchronous function we're not using a weight in front of this here we're just using it in front of these things so it's going to start this this is going to do its own thing and then in the meantime the code can carry on down here so once more let me just preview this I'm going to save it and then open up the runt panel and I'm going to go back and then edit location again and we can see hey they're prints it doesn't wait for all of this get data stuff to finish and then eventually we get this stuff when it's complete so hopefully that kind of explains asynchronous code a little bit to you because we are going to be using this kind of stuff in the future when we actually use a third party API to get time information and we're going to start that probably in the next two lessons also first of all I want to talk about flutter packages because to make these network requests we're going to use a package which is really going to help us so we're going to talk about packages in the next video

# 27 - Flutter Tutorial for Beginners Flutter Packages (http)
    all right and gang so occasionally when we're creating flutter apps we're going to need to add in some complex functionality now that could be to implement some form of animation or maybe to work with files and folders on the device or something else that is going to require us to write a fair amount of code and logic now I suppose we could do all of this ourselves from scratch or we could make use of flutter packages now lots of packages are basically just bundles of code and logic that other developers have already kindly written and which can normally be used to implement some kind of specialized functionality inside our own apps like a sliding menu or a date picker or some kind of file upload or something like that now we can use as many different packages as we want in our apps to do different things for us the one that we're going to be using inside this video is going to be the HTTP package which is going to allow us to easily handle HTTP requests to third-party ap is now eventually we're going to be using a third party API to get time information for different world locations but we could use this package to make any kind of network requests to different api's or endpoints so what I'm gonna do is first of all come to this address pub dev forward-slash flutter and then I'm going to search for a package called HTTP and press Enter and we can see the result right here now there's going to be quite a few different results and you see this little circle over here this is the score of this particular package now the higher the number generally the better it's going to be not always the case but it's a good indicator there's different measurements that determine this score things like popularity how often books are fixed things like that but anyway this is the one that we want HTTP and you've got a little readme here which kind of shows you how to do some of the basic things and we also have this score tap which I talked about these are the different areas it scores the package on so we get 100 which is good and you can see over here installing and this is how to install the actual package so it says here add this to your package pub spec Yamal file so all we need to do is grab that line of code right here and then go to our editor and add it in okay then so now we need to go to our pub spec file down here and we need to scroll down to where it says dependencies now at the minute we just have this but we need to go down to the next line and tab in one and we're just paste in the HTTP want like so so this right here is the version number this caret basically means that if there's a newer version when we get this package just install that newer version you a minor version anyway so let's save this and what I'm going to do is cross this off and then say get dependencies over here so that's going to go out and get that package for us and install it so we can use it inside our project okay so it's finished now so we can close this down so what I'm actually going to do is get all of this stuff here where we have this get data function and this in its state function and I'm going to cut it from the choose location state object because really we're going to load the data initially from the loading screen so I'm going to save this now and then I'm going to go to the loading widget over here and I'm going to paste it inside this state object instead so now we have this init state function inside here which is going to run when the widget first starts and we're giving it rid of this print statement we don't need that but we still have this get data function and it's up here still asynchronous but now let's get rid of this stuff inside it and actually use the HTTP package to make a network request to get some data now for now we're not going to get the actual time data we're going to use an API which is called Jason placeholder and it's just going to get us back some fake Jason's some dummy data if you like and basically we're going to use an endpoint which looks something like this and we're going to get some data back which is a to do we'll do that in a minute but first of all we need to import the HTTP package into this file so we can use it so we say import and then we want package and then we want the HTTP package so just do that one right there okay sorted now we can use this now the way we use this is by saying get and then in parentheses whatever the endpoint is that we want to get data from now the endpoint we just saw on this website by the way I'll leave this link down below so you can use as well this is the endpoint to get some data and this is going to return to us some JSON data so let me grab that and paste it in here now Jason works really well with JavaScript but we can also work with it in doubt and other programming languages as well it stands for JavaScript object notation so our objects that would get back from this look very much like JavaScript objects so what we're gonna do is now store this in some kind of variable now to do that we have to say await because we want this to finish before we store the value and then we're going to store this inside a response object like so so the response type here is actually given to us by the HTTP module and it's going to contain information about this response that we get from this request now one bit of information about the response is going to be the body of the response that's the actual data that we get back so what I'm gonna do is print it down here by saying response body so let's have a look at this in action what I'm gonna do is actually go over to the main darts and I'm going to change this initial route to be just a forward slash and that's going to load up the loading widget which is what we want to happen because this is the widget with all of this code inside it so let me save that now and then we're gonna go down here and we're gonna hot restart and minimize that so hopefully when it loads it gets the loading screen now if we keep this open you're gonna see we get this data back this is the stuff that is now printing down here it's the response body now this looks very much like a map right but it's actually not a map if we try to get one of these individual properties for example the user ID this is not going to work watch this user ID if we save this and we could already see that we don't have this property on this body but if we save it then it's not going to work and we get an error and that's because this is no actually a map or an object of any kind it's a string and that string looks like an object but it's actually not an object it's a string representation of that object and that's what basically Jason is so this is a JSON string and we need to convert it into some kind of format that we can use so what we can do is actually use a method or a function called JSON decode but to do that we have to import something so I'm going to say import and then I'm going to say convert and it's this one right here dartz convert and this allows us to convert this JSON string that we get back from this request into data that we can work with so we can do stuff like this so what I'm going to do is delete that right there and we're going to delete this print statement as well and instead what we're going to do is decode this JSON string by saying Jason decode like so and then pass the response body in now we can only use this function right here because we imported this okay so if we don't import this we can't use this so this is actually now going to return towards some data that we can use and it's going to be a map so I can say map and then data is equal to this thing and now if we print the data which is now the map it's going to look pretty much the same but I'm going to save it anyway and come to the run tab over here and I'm gonna hop restart so that we can get this data again and after a second or two now we can see this data it looks very similar now it's all on one line but if we try now to print one of the properties we can do so I can say now prints and then we want the data and then in square brackets remember that's how we can get values from keys inside maps we pass in the key here so I could get the title for example and that is going to get us this thing right here so let me know save this and hop restart and we should see that in a second okay so now we get the actual data and just the title as well so that was pretty simple right so all we're doing is creating an asynchronous function we're using this package right here so that we can use the get from and this get function goes out and gets data from an end point we await the response of that and store it in this response object of type response on that response object we have a body property and that body property is the actual json string that we get back from this we then decode that json string into a map stored in data we then print that data and the title property from that data so we can actually do something with this data now so now we've seen how to use this kind of asynchronous code and the HTTP package and how they work together in flutter let's try now getting the data we actually need for this application using the world time API

# 28 - Flutter Tutorial for Beginners World Time API
    all right southern gang ultimately we want to show time data on our app and to do that we're gonna have to use some kind of API to get time data so I'm going to be using this free API here called world time API and I'm gonna leave the link to this down below so if we go down here and scroll to the bottom we can see if we go to the time zone list it's going to give us a list of all the different locations we can request to to find out the time in that location so there's quite a lot of different places around the world that we can query so I'm gonna do a search ctrl F and then look for London and I'm gonna click on that and now you can see we get different information about this on the webpage but this is all the information we get from the response if we make an HTTP request to this so we can see the day of the week the day of the year the week number etc and we also get the times down here so we can see the current date time we can see the offset so we need to add this to this over here to get the actual time okay so let's now have a look at this we can see we can get it in JSON or plain text format we're gonna work with Jason so if we click on this we can see this is the data we get back the different properties and this is the endpoint that we actually need to make a request to to get this data so I'm just going to copy that dude and minimize this and then over here this is where we want to make the request for that data so first of all I'm gonna delete all this stuff right here because we don't need that and I'm gonna change this to get time and when we call it we need to change it over here as well get time and by the way we're still in the loading screen over here and then inside here we can first of all make the request right so to do that we're going to say response response so we're storing the response inside this object then we're going to await this response first of all we get the data by using the get function and we pass in the endpoint right here so now we're going to go out and get that data and what we could do is just print that data but first of all let's turn it into some kind of format that we can use source a map and then the data is equal to JSON decode we pass in the data or the response that we get back and then the body of that response which is where the actual data is stored so let us now print out this data so I'm going to say print and then the data so I'm going to now save this and open up this panel then I'm going to hot restart by clicking this we should see after a second we get all of this data back okay so the things that we need are the date/time which is somewhere down here I can't properly see this so let me just move this up okay there it is date/time this is the thing that we need right here okay and we also need the offset which is a right here because we need to add this this extra hour to the date/time to get the actual local time inside that city so that let me now minimize this and let's sort this out first of all I'm going to comment this dude out because we don't want to print it every time we get the data and the next thing we want to do is get those properties from this JSON data so I'm going to say down here get properties from data okay so we want the date/time and we also want to be offset they're both strings so let's say string and then first of all dates time is equal to the data which is this stuff we get right here and then we want the date/time property so date time like so okay so now we've got one of those things and then the second thing we want is the offsets or say the offset is equal to data and then the offset property so that makes sense doesn't it we've got those two properties now the date/time and the offset so what I'm going to do is print knows badboys first of all I'm going to say date/time and then underneath that print offset just to make sure that this is working as we're going along one of the worst things to do in coding is to write a hell of a lot of code and then preview it preview it as you go along because if you do make a mistake you can see it right there when you make the mistake rather than getting down 20 minutes down the line and not knowing where you messed up so if we save this now open up this panel and a hot early start then we should see after a and these two things okay so we get null for one of these things and that's because this property right here is not actually offset its u T and then C underscore offset so that's a prime example of what I just did if I was to carry on later on and use this somewhere this offset variable then I might not know where the problem is but since I did it right here right now I know that this was the problem so anyway let's try this again hot restart and hopefully now we don't get in the hole and we get the plus one okay so this is kind of like the date/time string and this is a string as well which is plus one now we need a way to kind of put these together so add this one to this and also get it in a format which might be a little bit better so what we're going to do is actually convert this into a date/time string or a date/time object so we can do that in doubt pretty simply underneath here and in fact I'm going to comment these two outs as well because I don't want to see that inside the console every time I run this so the third thing we want to do down here is create a date/time object essentially now we can do that in dart by using the date/time class and then we want this to be called now so we just created a variable which is of type date/time and we're going to set that equal to a date/time object like so so we're instantiating this and what we want to do is actually use a method called pass on this and we need to pass in this date/time variable and we'll pass it in right there so we're taking this date/time string which is a string which represents the dates and passing it into this method on the date time plus and what that does is actually converted into a date/time object so if I was to say now print now down here and save this let's open up this dude and hop refresh your hot restart and now we can see this is the new kind of date/time does not that much difference but now it is a date/time object all right so now we have that now it's a date/time object we can use a method on this date/time object this instance of it which is because that's where we store the instance we can use a method called at and we use this method to add a specified amount of time or a duration to a date object now we've seen the duration object in a past tutorial as well we use the duration object like this and we pass in how many seconds or hours or you know days we want so it's going to be hours in our case and what we want to do is pass in this offset but at the minute it's a string which has a plus in it and a zero and in fact let me comment this out and then just uncomment this so we can see it I'm going to save it and then go to run and then hop restart and we can see we have these two characters at the start which we don't really need so what I could do or rather to be honest it's just this one isn't it but we could make a substring from this which is just the actual one the number itself so I'm gonna say over here I'm gonna say dot and then use a string method called sub string and then inside there I'm going to go from position 1 to position 3 now if we preview this now and hot restart then hopefully we should see just 0 1 because now we created a substring from that string okay so now we can use this number we can turn it into an integer because currently is still a string but we can turn it into an integer and I'll show you how to do that in a second and then add that integer as an hour to this date which is what we want to do so let me comment out that do it again and uncomment these two and then here this expects an integer and we have a string so we can convert that into a string by saying int dots pass and then passing in that string so it's going to take that string and pass it into an integer so 0 1 string will now become 0 1 integer so we pass in the offset variable and I think that should pretty much do it let me just put a semicolon at the end and now if we print this it's gonna be an extra hour so let me save it and run then we go to hot restart and hopefully we should now see this is the actual time in London and actually that's still an hour behind and that's because I made a glaring error this is non-destructive so we need to update the now variable so we need to say now is now equal to now dot add and then this extra time so now we're updating the now variable because this is non-destructive it doesn't directly update it so if I save it now and then go to hot restart hopefully now we should say 554 of something similar awesome so now we get the updated time that is the right time now in London so in the future we could update this location over here to several different locations when a user can choose that and then it's going to go out make that request and get the time in that location so all of this is looking pretty good now but this is quite a lot of logic right here and I don't really want to just sit in here on the loading page it makes it messy and it makes our code a bit less reusable so in the next video we'll see how to separate all of this logic into its own class in a new file

# 29 - Flutter Tutorial for Beginners WorldTime Custom Class
    all right the my friends so in this video what I'd like to do is take all of our world time logic and this get time function down here and separate it into its old file inside a custom class and by doing that what we're doing is making the code much more reusable because then that class can be imported into any file or widget that needs to use it in the future and it's also going to clean up this widget as well because then we can remove all of this code which is good so first of all let's create inside the Lib folder a new folder called services and we're going to put the world time class inside here because after all it's a bit of a service we're going out and getting some data so we don't have to put it in this folder you can put it somewhere else if you like I'm just trying to organize our code a little bit but inside here I'm going to create a new dance file and we'll call this world underscore time so this will be our world time class now the first thing we need to do is import a couple of packages at the top that we'll need inside this class and those packages are going to be this one right here HTTP so that we can make this request and also this dark convert package so that we can use JSON decode so I can actually cut those from this file because will no longer need them in here because we're going to get rid of all of this code and I can now import those into this world time file so let me place them there and down here now we're going to create the class so I'm going to call this world time like so now inside we first need to declare a few different properties first of all we need a location property and that location is going to be the actual location we show on the UI that user sees so a user friendly location so I'm going to say string and call this location and we'll just initialize it for now we don't give it a value yet because we're going to pass those values in via a constructor later on but let me just place a comment to say what this is some location name for the UI ok the second thing we need is now the time so the actual time in that location and again we're going to show this on the UI over here so let me create another string for this and call time and we don't initialize this with a value and then this is going to be the time in that location okay the next thing I want is going to be a flag now ultimately we're going to be showing a little image or a thumbnail of a flag next to the location and those flag images are going to be kept in some kind of image folder in our project so what we need is a URL to whatever flag we want to use for this location and we're going to store that inside a variable so we'll say string again and this time flag and this is going to be a URL to an asset flag icon okay and then finally we also need a URL for the API endpoint now if we look at this request over here this is the URL and this is the location in Europe and then London so that's part of the URL and that's what we're going to store inside this thing over here this new variable called URL so string URL and that is then going to be tacked on to this thing over here because that is going to stay the same in the API call all the time this thing over here is actually going to change so that will be the thing that will update every time we create a new instance of this world time class and we'll store that inside this property called URL so we'll say this is the location URL for API endpoints okay so then now we have those properties we also need a constructor we'll do that in a minute now the first thing I want to do is bring over this function over here this get time function because all of this now is going to be inside this class so let me cut that from here and let me go over to the world time and I'm going to paste it in and we will need to edit this a little bit let me just get rid of that for now so we're still making this request right here but now instead of hard-coding this I'm going to pass in the URL here so instead of this thing right here we pass in the URL so instead I'll delete that then dollar sign URL okay so that should still work once we pass this value into the constructor of this class that should be fine this is still fine as is because we still want the data in a format that we can use it in and we're still grabbing the values that we need right here as well that's absolutely fine and then down here we're printing now we don't really need to do that anymore so I'm gonna get rid of that for now and what instead I'm going to do is set the time property up here based on what we get down here now I said that the time property is gonna be a string so this down here once we finish with it is a date time so what I'm going to do is convert that to a string and set it to this property over here the time property so let me come down here and I'm gonna say time which is this variable is now going to equal to now which is this thing we have right here the actual date time and I'm going to use a method called two string to convert that to a string so now we're storing this inside the class itself okay in that property so let's do a little comment to say that set the time property and that's all we really need to do because when we create an instance of this class in the future we're going to pass in this value to it so that will be set we're going to pass this value to it so that will be set and we're going to pass this value to it so that will be set this is now being set once we call the get time function and it's been set down here so now all the properties will be set so now what we need to do is create a constructor so let's do that right here so world time is the same name as the class itself and then inside this function we're going to use named parameters so we can just assign those values by saying this dot location so we'll pass that in as a name parameter called location and it's going to auto assign it to this variable right now then it's going to be this dot flag then it's going to be this URL so we're expecting in the constructor to receive all of these different values when we create a new instance of this world time class so now we've done that what we could do is actually create an instance of this class and the way we do that is something like this I'm going to create it down here to begin just to show you we create a new world time variable so we say the type first of all which is world time then the variable name I'm just going to call this instance but you could call it what you want and we set that equal to a world time instance now we need to pass in those named parameters and they were called location flag and URL so let's first of all say the location and the location is going to be the UI friendly location so not this thing right here where it says Europe forward slash London it's just going to be London for example or Berlin so let's do that let's say Berlin and then next we could say after that the flag property is going to be some kind of image URL or at least an image file name so we'll call this Germany dot PNG right because it will look over here for our image assets and find this Germany PNG file eventually when we use it and thirdly we're going to pass in the URL which is the API endpoint over here so that would be something like forward slash Europe and then for slash Berlin so let's go down here and say the URL is Europe forward slash Berlin ok so that would essentially create us now an instance of this class and it would set all of these three properties and then when in the future we said down here if I go to the next line instance dot gets time it's going to run this function over here it's going to make the request based on the URL that we pass in and set right here and get the data do all of this stuff right here and then it's going to set the time property at the end and then in the future we could use that time property on this instance so let's now get rid of that and instead let's go to our or the file over here loading and update this because now what we want to do is import this class and use its functionality so let's go over to this file and do that so the first thing we need to do is import that file and I'm going to do that right up here so I'll say import and then we want ultimately the services thing over here we'll time services and then /world underscore time darts so now we're importing that file and we can use it down here so at the minute inside in its state which runs when this widget first loads we're trying to run this function get time but now it no longer exists over here instead what I'm going to do is create a new function so I'll say void because you won't return anything and it's going to be set up world time now this function inside here is going to create a new instance of that world time class so I'm actually just gonna copy this dude or cut it and then save this and paste it over here so let me paste that in and now we have this instance right here of this world time class right and we're passing this data in so now what we could do is use instance get time like that and that is then going to run that function inside this class over here get time to get the time and set this property now first of all we need to update this function call to be this function call so let's change it to be setup world time so once again let's just quickly go through this but before we do let's just correct this typo it should be world and hut word okay so when we first load up the app this loading screen loads first right and then when this widget starts we run this function once and we're calling this setup world time function when this function runs were creating a new instance of the world time class and passing all of this data in then we're running this function down here instance get time to go out make the request to that endpoint get the data and set the time property or peer so now we should have access to the time property and you might think we could do something like this print and then instance dot time because now we have access to that time property but actually we don't yet and this is not going to work because remember when we call this function this thing is asynchronous this whole function and this whole operation is going to take some time to do it might take two seconds today because we have to go out and reach the data and bring it back so if we try to print something straight away then it's not going to work because remember if we run an asynchronous function this doesn't stop the code from carrying on it just does this in the background and then the rest of the code carries on so it's going to then try to print the time before we even get it back or set that property so what it would be nice to do is to maybe put and await keyword in front of this so then we're waiting for this to finish before it carries on and then prints the time and we use the time but we're getting an arrow right here at the minute and that's because we're not returning a specific type that we need right here if we want to use the await keyword in front of a custom async function that we create and this is asynchronous that's absolutely fine but we have to place the future keyword right here and then surround divide in angle brackets so this is telling doubt that the function is temporarily going to return what's known as a future and a future is a bit like a promise in JavaScript and it means that it's a placeholder value until the function is complete it essentially wraps our void type right there and says look at some point I'm going to return void but only when this asynchronous function is fully complete so the future is a temporary placeholder value the kind of let's start now when an asynchronous function is complete and if we want to use a weight on a custom function like this we always have to put a type of future in front of our asynchronous function so that our await keyword over here right here so that this knows when that asynchronous function is complete and then it can move on okay so if I go over here and save this now and then come back over here we still get an error and that's purely because now we're using a weight inside a function which is not declared as asynchronous so let's just pop a sync right there and that will sort this out okay because remember it want to use a weight inside a function that function has to be declared as asynchronous and by the way when you first start to use all these weight and async keywords and futures it might seem a little bit overwhelming a little bit complex but honestly once you've played around with it a few times it becomes second nature to you it's very similar like a sense of promises and a sink and a weight in JavaScript but anyway now we have all of these functions set up now it's the moment of truth to try this out so I'm going to save this and then I'm going to go to the run panel and do a hot restart so if I do that then hopefully we are eventually going to see this thing printed out down here so this is the time that is printed out so we've loaded this widget we've fired this function which is asynchronous we're creating an instance of the world time class passing in all of the information then we're firing the get time function which is now awaiting the response over here before we move on when we get that response and we set the time inside the instance then we're finally printing that time so now what we could do is actually output this time over to the UI somewhere if we wanted to so what I'm going to do in fact is a quick example of that I'm going to over here create a string inside the state object in the loading widget and then I'm going to call this time but you can call it what you want and initially I'm going to sell it to be a loading so now down here here what I'm going to do is output this variable so instead of outputting this text right here what I'm going to do is first of all output a padding widget and then inside the padding I'm gonna do a padding property just so it moves down a little bit and we can see this more clearly and this is gonna be edged in sets and it's gonna be all and then 50 pixels are panning all the way around okay and then finally what I'm going to do is a child property which will be a text widget and this will output the time data that we declared up here so let's just output time in here like so okay so when this widget first starts the initial value is going to be loading until all of this stuff is complete once get the data back and we move on to this thing right here what we're going to do is use set state to update that time property so I'm going to say set state and then inside this we need a function and that function is going to take the time property and now set it equal to instance time the thing that we get back from our class so let's give this a whirl I'm going to hots restart again and then hopefully we should see this change to the time so when it first loads we see loading because that is the initial value and after a second or so once this is all complete we see the new value because we set state that triggers a rebuild and we update the time over here so once more watch over here it's very quick okay too quick loading and then this so it's only there for a split second but it is there while everything loads and we get the data so then now we have this world time class setup and we're instantiating that in our loading widget now the idea is that ultimately whatever a user chooses a different location in the future from some kind of list then we're going to create an instance of this class right here and then we'll go about getting the time of that location using this get time function method on that class instance and then we can update the time on the home screen that's ultimately what we're going to be doing but first in the next video what I'd like to do is look at handling errors in this code

# 30 - Flutter Tutorial for Beginners Error Handling
    okay no my friends so currently our code all seems to be working correctly but what if at some point there's an error somewhere along the line when we tried to collect the data for example when we instantiate the class we might pass in a URL for the endpoint over here that's not valid or it could be that this is not valid over here so we could add say an S on here and this is not going to be the correct endpoint anymore and therefore when we try to get data from the endpoint it's not going to return towards the response that we expect and then when we tried to convert that response into a map that will probably fail therefore all of this is going to fail at some point and when we go to set the time property of this instance then it's not going to be what we expect and so when we try to update that time and output it then it's not going to work so let's just demo this I've changed this so it shouldn't work now I'm gonna save it and then I'm going to go to run and press hot restart now notice over here we're going to see in a second loading but that never changes because we never get a valid time to show and down here also in the console we have all of these errors so we need a way to combat this and to do this we can use in doubt what's known as a try and catch block where we try to do something but if that fails and there's an error we can then catch that error in a catch block and execute some different code so it looks something like this let me just do a try and then we do curly braces and we try something inside these curly braces ie this code down here now if that fails underneath we have a catch block which catches an error in parentheses and then we can execute some different code instead if we get an error okay so let's try this I'm going to grab all of this code right here and this is what we're going to try to do so I'm going to paste it in here and then we're going to try all of this now obviously this is gonna fail because this endpoint is incorrect we don't have an S in the endpoint and down here what we're going to do is catch the error and print it so let me print now this error object that dart has created for us based on this error so I'm gonna print a string which says caught error and then the actual error variable so let's see what happens now I'm going to start and by the way we will get an error over here now because now no longer are we setting the time variable now as soon as there's an error we're going on to this catch block and now we're not setting the time variable over here so therefore when we update the state over here we're setting this to be null and that is going to error out over here so let me now just come down here and go to hot restart and notice you'll get a massive error over here and also the same errors over here but if we scroll up now we should see at some point our little message there we go caught error right here that's what we print out and also the error message which is type list dynamic is not a sub type map dynamic so basically that's saying somewhere up here probably where we're trying to create this map this right here is not returning us a map so we can't do this so it's forcing an error because this is not returning the data that we expect so that's fine we've printed out that error message now in the console for us to see but also what we should do is something so this doesn't happen so what I'm going to do is update the time variable inside here and I'll set it to something like could not get time data okay so at least the user knows what's going on and they don't see this red screen of death or whatever so now if we were to save this what we're doing if this an error is coming to this catch block printing this message then updating the time variable to this message over here so we get that back over here and when we set the state we update it to be that message instead of loading and therefore that message is going to be output to the user so let me save all this go to both files and save go to run and then go to hot restarts cross your fingers and hope this works okay cool so now we can see this thing could not get time data now we don't get all of those other errors anymore because we're not trying to do something with that Nova you have time anymore that would cause those errors this time we're simply out point this could not get time data and we also have an error force in the console so we know what is going on and that is a better way to handle this error I think so now we've seen that let's just go back to here and take off the s and make sure this still works I'm gonna save it and and then going to run it and hopefully we should see the actual time over here now cool okay so that's error handling sorted for now and now we have this time data the loading screen is kind of almost serving its purpose it's loading up the data it says loading we're going to replace that with some kind of spinner later but it says loading the next thing to do is to redirect to the home page once we have this data so we can actually show this on the home page so we'll look at how we can pass this data from one widget to a different widget or rather from one routes or routes to a different route in the next video

# 31 - Flutter Tutorial for Beginners Passing Route Data
    southern gang our loading screen now is the first widget that loads when we start the app and what we're doing is getting the data we need the time and then at the minute we're just outputting the time right here but once we actually successfully get the time and it finishes loading that would be a good time then to actually redirect to the home screen so instead of playing around with this time in this widget and setting the state and then output in here let's now instead redirect to the home page so I'm gonna get rid of that I'll get rid of this print statement as well and also get rid of this string time because we now no longer want to output the time over here we'll just say something like loading again and now once this is finished then we want to redirect to the home page now we've seen how to push to a new route in the past and that is by using the Navigator object and using a method called push named and then we could redirect to another route now it passing the context object first of all as the first argument and then the name of the route we want to go to which would be forward slash home now this would work right and I'll demo this if I save it and then go to run and Hawtree starts then it's going to load and eventually it's going to go to the home page over here but what we did right here is actually push this home routes on top of the loading routes and we don't really want to do that we don't want to keep the loading routes underneath so instead if we wanted to we could use a method instead called push replacements named and this does pretty much the same thing it's going to push to this route but it's actually going to replace the routes underneath this one so this now no longer will be sitting on the stack of screens underneath the new one that we go to all right so then we can do this now let me save it this is still going to work let me just demo that hot restart and once we've loaded it goes to the Edit location route but we don't have this route underneath it now the loading screen cool so that's the first step however now inside this screen we want to output the data and unfortunately inside this screen we don't have access to that data we have the data in this widget right here but not inside the whole one now fortunately there is a way to send the data that we get from this widget into this new route of this widget and that is by using a third parameter over here inside this method and that third parameter is going to be arguments and it's going to be a map so right here this is basically a named parameter and this map is going to be a set of key value pairs that we can pass through into the widget or the screen that we route to which is the home screen so these key value pairs are going to be basically what we want to send to that next route so we want to send a few different properties we want to send the location if we open up this class over here we want to send a bit of data the location the time the flag and we don't need the URL because we're not making any more requests just these three bits of data because we're going to show automatically all of those on the screen so let me now define a property name called location first of all and this is going to be equal to the instance which is what we create up here when we create a new instance of the class and then we want the location property so that's the first thing we want to pass to the new screen the next one is going to be the flag and that is going to be the instance dots flag property and then finally we want the time and that is going to be equal to the instance dot time property so now we're passing all of these different properties through to this next route and we can actually access those now from this widget so how do we do that well the first thing I'm going to do inside this state object is declare some kind of variable the ultimate loan we're going to store all the data rent and we'll make that a map because at the end of the day we're passing a map of data here and we'll call it data and we're just going to set it equal to an empty map at the minute so initially when we start up this state object it's gonna be an empty map of data now then inside the build method this is where we receive the actual arguments that we send over here and the way we do that is by using modal route and then docked off then we pass in the context and this is why we need to do it in the build method right here because we need this context and then we say dot settings dots arguments so this is going to be the arguments that we receive over here so it's going to return a map of data so what we could do is just update now this data to be whatever comes back here so I'm going to say data is now equal to this now you might be looking at this and thinking why did you not use set state but think about it we don't have to use set state yet because this is the first time the build function runs and we're declaring this data and overriding this before we even return anything so we're doing this first and then we're building up the widget tree so now I can access all of this down here inside this widget tree but we'll do that in the next video what I'm going to do for now is just show you that this is worked I'm going to print out the data right here so now let me save this and go to run and then hot restart and hopefully it will see all of this data printed out down here or like this so now inside this widget we can access any one of these properties the location the flag all the time and output it inside this widget tree and we're going to start doing that in the next video

# 32 - Flutter Tutorial for Beginners Formatting & Showing Dates
    okay then going so now we've got to the point where inside our home screen we have access to the data we need including the time which we ultimately want to output to the screen but at the minute this time kind of looks a bit cruddy I'd like to maybe format this in a different way that looks a bit better so to do that we're going to use a package from flutter and that package is called intel over here and you can see inside this contains some date formatting and passing so we're going to use a function from this package that is going to help us format our date in a nicer way so to install this we just have to grab this thing right here and we're going to paste it inside this file if I minimize this we want to go to pub spec gamal and we want to go down to our dependencies and they are here so let me come underneath the HTTP and paste this one in and save it then going to close this off I'm going to click get dependencies to update that and grab that dependency so once that's done I need to go now to our service file which is this world time and this is where we're going to format the date so first of all we need to import this package and to do that I'll say import and then I'm just going to look for intel and it's gonna be this one down here okay so now down here we want to use a function provided towards by this package and all willing to do is delete this dot first of all and then I'm gonna say date format which is provided to us by that package we just imported then use a method called JM and then a method on that called format and inside here we're just gonna pass in now so I'm gonna say now like so and this is going to format that date into something that looks a lot more palatable so if I save this now and if we go to run again hopefully when we see the new data printed it's gonna be a bit better and get a hot restart and in a second we should see the time and there we can see it's now 1:20 p.m. that looks a lot more human readable and that is ultimately what we're going to output to the screen so now we have this data inside the home screen let's go about using it inside the template over here so currently this flat button this is inside a column so we're just gonna add some more widgets to this column the first thing I'm gonna do is a sized box because that gives us a bit of breathing room between different widgets in a column we've seen our already and this is gonna have a height of 20 pixels alright so the next one I'd like to do is a row and the reason I'm gonna do a row is because underneath this flat bottom we're gonna have two things next to each other on the same level and that is going to be a little icon of the flag and also next to that we're going to have a text widget which is going to output the location now we're not going to do the icon just yet but I'm placing this row therefore in the future what I will do is say children and then this will be a list of widgets and we'll do the text widget for now so this text widget is going to say inside it the location so we need to grab the data variable that we have now and then inside that we want the location property so if I save it we should see that on the screen now cool looking good but we want to style this a bit better so I'm going to say now we want a style property inside this text widget and this will be a text style and inside here we want to format the text a bit better we want to make it bigger for a start so I'll say font size is going to be 28 like so 28 pixels and then also the letter spacing will give a value of about 2 pixels okay so save that and that looks a bit better now while I'm here what I'm going to do to this row is go to the main axis alignment and I'm going to set that to be Center so this now is going to sit in the center so let me save it and preview and that looks a lot better now I also want to bring this down quite a bit as well so I think what I'm going to do inside the safe area and surrounding this column is add some padding so let me go to this Action menu and then go to add padding and then I'm going to change this to instead of all I'm going to control each side separately so I'm going to say from and then it's l CR B so we can control the left top right bottom independently and the left is going to be 0 the top is going to be 120 pixels and that's what's going to bring it down quite a bit now then the right is going to be 0 and the bottom is going to be 0 so if I save it now hopefully yep it brings it down a fair whack okay so then for now after this row what is the next thing we want well that is the time itself but before that we need another sized box you know I can do this correctly so size box and then in there we'll say the height is going to be this time 20 pixels again maybe so let's do 20 and then after that we want a text widget to output the time so again this time is now stored on the data so we need something similar to this we'll say data and then it's the time property that we want so let's save that and see it okay looking good but this time what we need to do is make this style a bit better so we'll say style and then text style and all I'm going to do is probably just increase the font size so I'll say fonts size and we want to make it nice and large so 66 pixels save it and that is looking pretty good okay cool so now if we hop restart we should see the updated time so 1:24 p.m. in building and there we go my friends we've now formatted our time down here inside whoops wrong file so we'll time so we format at the time right here just by using this junior method and the format method and we did that using date format by installing and importing this package or right here so we get that updated format which looks a lot better for the user then inside the home screen all we're doing is outputting this data that we get back from the loading screen so we receive it here we store it in data and then we output in that data down here inside the widget tree so this is all looking pretty good so far what I'd like to do in the next video is go back to the loading screen because currently the loading screen looks a bit pumps if I hot restart will quickly see it over here so hot restart we see the loading screen there it looks a bit rubbish I'd like to make that look a bit better by using a spinner and to do that we'll use another package for flutter and we'll see in the next video

# 33 - Flutter Tutorial for Beginners Loaders ⧸ Spinners
    or other gang so at the minute we have a loading screen when we first start our application which loads the data then redirects us to the home screen with that data when it's complete but at the minute the loading screen looks a bit of rubbish so if we click hot restart over here we're going to see that loading screen very quickly over here and you're gonna see exactly how rubbish it is you can see it just says loading in the top left not very good at all so instead what I'd like to do is form some kind of spinner in the middle so that users know it's loading but it looks a bit better than that loading text at the top left now to do this we could make our own widget but that would be quite complex and instead I'm going to use a package called flutter spin kit so you can see right here if we scroll down there's a lots of different spinners we could use and to install it we just need to go to installing and copy this thing all right here so let me do that and then minimize this so over now inside our pub spec gamma file let's add in this package so paste it in save it cross this off and then click on get dependencies to go and get that package so now we can use this package I'm going to go to the loading screen over here and currently all we're doing here is showing this text widget now I'm going to get rid of this text widget for now and in fact what I'm going to do is get rid of the padding as well so let me just get rid of all of that and instead what I'm going to do is return a sense of widget because I want to put this in the center of the screen now how do we use this well first of all we need to import it so let's go to the top and let's say import and then just look for spin kit and we can see it's gonna be this one down here so flutter spin kit now we can use this package inside this widget and to construct this I'm gonna go back over here to see how you do it let's go to example nope okay that's good to read me then and okay so we can see exactly how to do it down here so all we're doing all we need to do is just grab this this is a rotating circle so let's minimize this and go over here and place it in the child property of the center widget so okay so now we don't need the semicolon we need a comma instead and this should give us a rotating circle now it's gonna be white so it might not show up so I'll tell you what we'll do add a background color to this scaffold and that is gonna be colors and we'll make it blue so blue and then a deep blue so now hundred now I'm gonna save this and go to run and then I'm gonna hot restart and hopefully we should see a little spinner like that instead while it loads now it's taken a while to load this time but eventually it does go to the homescreen so that's pretty cool this is all we need to do just add in a spin kit widget like this and that's all it is a widget with some different properties that we can customize it with so I can make this bigger like so I can make it a tit and if we save it now and run it again it goes hot restart and see this in action now it's a bit bigger wasn't there as long but if we do want to preview it for longer what we could do is just comment out this where we navigate to the next page once we have the time now if I save it and go to run we can see this hopefully is gonna be what the spinner looks like okay and it's not going to go to the next page so this is a nice way to preview it now what I'd like to do is choose a different spinner than this circle so let's see what we've got if we go to the start and go all the way down we can choose from any of these different spinners and these names here these are basically the names of the widgets that we use so say for example I could use cube grid and I just grab that I'm going to copy it and come over here and paste it in here instead of rotating circle and paste it there so it's pink it then whatever it's called save it and this time we get this square effect okay so I'm going to do one more and I think I'm going to choose the fading cube which is this thing right here oh no that's the folding cube I'll choose the folding cube that's absolutely fine so let me grab that and paste it right in here if I can't okay let's save that and see what that looks like okay that's absolutely fine and there is one called fading cube just to show you I'm going to say that and now we can see this one so in fact I think I will stick with this fading cube for now what we need to do is uncomment all of this over here so that we do go to the next screen and then I'm going to go to run hop restart and see if this works so we load and then we see this screen and that my friends looks a lot better than that little floating thing at the top left you can read more about all of this by going to the flutter package on this website I'll leave this link down below to this package and you can go to an example and then go to the documentation to have a look so that you can see how you customize these different things on this page as well so now we have that sorted I think the next step is to kind of style the home page a little bit more and maybe look at adding the background colors and background images to this screen

# 34 - Flutter Tutorial for Beginners Ternary Operators
    rather than gang so far we show of the time and the place on this home screen now it would be nice if we could show maybe a background image either night or day depending on what time of day it is now to do that I'm gonna have to show you how to use a ternary operator I mean this is not the only way to do it but I thought this would be a good opportunity to use a ternary operator in dart so what I'm gonna do is go to the world time class over here and I'm gonna create first of all an extra property and this will be a boolean so bool and then we'll call this is day time like that so this is basically gonna be either true or false if it's true then it is going to be daytime if it's false then it's gonna be nighttime so true or false if daytime or not okay so then we'll use that to find out whether we should show either the night image or the day image and maybe even have a background color so it shows at the top as well and we'll see all that in a second so first of all we need to set this to either true or false so we need to evaluate a condition and then if that condition is true then we'll set it to true if that condition is false then we'll set it to false now to do this we can use what's known as eternal operator and a ternary operator is pretty much the same in most programming languages it goes something like this we have a value which is going to be is daytime so we're saying okay well we're going to set this value right here and that is going to be equal to some kind of condition and that condition is going to evaluate to either true or false and then we have a question mark after that and then we have the value we want to return and assign to this variable if this condition evaluates to true and what we'll do is say okay well if that's the case datum is going to be true and then we do a colon and if this evaluates to false we pass back some kind of value that we want to apply to this variable if this is false and in this case it's going to be false as well now these don't have to be billions right here this could be a string and this could be a string doesn't really matter just so happens that we're storing a boolean inside this variable now we need some kind of condition to evaluate what we want to find out is for example is the time now so this date time that we have because we've not converted it into a string yet this date time that we currently have is that say between the hours of 6:00 in the morning and 8:00 at night so if that was the case then it would be daytime so what we could say is now dots hour and that gets us the hour and that can be anything from 0 to 23 so is that greater than 6 so greater than 6 a.m. and so we're evaluating two conditions at once here they both have to be true for this to pass now dots hour is less than 20 which is 8 o'clock so if the hour is greater than 6 and the hour is less than 20 that means that the time right now is between 6 a.m. and 8 p.m. so that in my eyes would equate to being daytime so if this is true if the hour is somewhere between there then is daytime is going to be assigned at this value of true it is data if it's not it means that it's either before 6 a.m. or after 8 p.m. and in that case it means that it's nighttime so therefore we're going to return false because this will be false now and then false will be applied to this variable ok I hope that makes sense so now what I'd like to do is actually pass this value into the home page because we need to use it right here because currently we won't get it because we're not passing it to this page from the loading widget we only pass these things at the minute so let's now pass that forth property and that is called is daytime and we set it equal to instance that is daytime okay so now we're passing that through let's save this and let's go to the home and let's just try this because we're printing the data let's see if we get that through so I'm going to run this go to hot restart like so we should see the loading screen momentarily and then we see at the time and now we can see is daytime is true so now we have this variable true inside this widget we can use that to decide whether to show and image or daytime image now you can find those images that we're going to use on my github repo for this tutorial series just make sure you're on the lesson 33 branch then go into the assets folder and you're gonna see day and night so you can download those right here okay so they look something like this they're quite huge not sure why I made these so big to be honest but you can downsize them if you haven't what you probably should do but anyway I've already downloaded these images right here and they're inside this world time folder so what I'm gonna do is just grab both of those the night and the day and I'm gonna move them over into this thing this project over here so let's now create an images folder inside world time so go to new and then go to directory and we'll call this assets and then inside there we want to put these two things so press ok and now we should see those okay night and day are in there so now we have those inside assets we need to tell our flutter app where to find those so we need to open up the pub spec file to do that let's scroll down to where we're using the assets right here so uncomment that and zoom this assets word back one space then we just need to specify the images or rather the assets folder and because we're going to be using multiple images directly inside this folder I don't need to specify every individual file I can just use that and then we can use any file directly inside that folder so let's save this and head back over to home click get dependencies as well and now we can start to use these images so what we need to do now is perform some kind of check to see lock is from the data that we get here is it daytime or is it nighttime so again I'm going to use another billion to decide what the background image is going to be so under here I'm going to do a little comment to say set background and then I'm going to create a new string and we'll call that BG image and set it equal to data that we receive through this thing right here and then we want inside that the ease dates is daytime property so that is going to be a billion at a truffles so we're going to evaluate that inside a ternary operator so question mark then if it's true we return one value which is going to be day dot PNG because if this is true it means it's daytime therefore inside this variable we're gonna store this value dot PNG which is what this is called dmg then colon and if it's false we're going to give the value night PNG to this variable instead so now dependent on this thing right here if this is true or false what either going to get day or night PNG stored inside this variable so now we can use this to output an image and down here somewhere so this is actually going to be a background image and it's an output this we're going to use a combination of a container and a decoration image inside a box decoration now we've not seen this before and a box decoration which it gives us a way to apply some kind of background image to fit the screen so let me show you how we do this it's going to surround everything inside this padding so I'm going to go to this padding and then say wrap with new widget and first of all it's going to be a container it must be in a container first of all now inside this container we're going to have a decoration property and this decoration property it will be a box decoration now if you do get confused with this you can't just check out the docks because it shows you what all of these widgets are for I mean I don't have enough time in this video series to go through every single widget and every single property and explain every little bit but you can read more about them on the documentation it is really well documented and shows all the different properties that can be applied to every single widget but this box decoration widget right here can go inside a container and then we can use an image property inside down now we're not just going to use an asset image directly here what we're going to do is use what's known as a decoration image and this is basically going to allow us to apply a background image to the whole thing around here so this widget is going to taking two properties it's an image first of all which this time is going to be an asset image and inside there we need to pass through the path to the image we want to use so I'll say assets and we'll hard-code this for now I'll just say night PNG and then below that we want to say fit and then this is going to be box fit dot cover so what that means is that it's going to cover the entire screen that's what this fits property determines how it should fit inside the container and this cover means it's going to cover the entire container all over the screen so it should be the full background image so I'm going to save this right now and see if this works and we can see now that we get this background image okay so that's pretty cool and what I'd like to do now is instead of hard-coding in fact let's see the day one first of all so today and save that and now we see this image as well okay so they look okay but what I would like to do is instead of hard-coding these output whatever value is inside BG image because that's going to be either day or night dot PNG so let's do this I'm going to say dollar and then BG image like so now if I save it because it's 3:05 p.m. and we said that if it's between 6 a.m. and 8 p.m. then it should be day this is obviously true and therefore we're getting de PNG back and that's what we're outputting right here so that's why we see the day image but if we were to just tweak this and say for example ok well if this is after 15 which is 3 p.m. then it's night save this now we should see the night image over here now but I do have to do a hot restart because we're changing the data so I'll do that and now we see a night image obviously it makes no sense to be 3pf so let's change this back to 8 which is 20 and then hot restart again and that is I think gonna look a lot better ok so we get the daytime image now so one more thing or rather two more things I want to do you see at this top strip over here this is still great and I'd like it to be a blue now I'd like it to be a light blue color if it's daytime and I'd like it to be a dark blue color if it's nighttime and the reason we get this by the way is just because this image is not covering under this a very top strip if we apply a background color to this scaffold it will be visible under this strip so what I'm going to do is do another ternary operator now to find out what background color we could use now the type of this data is going to be a color so we'll say color and we've seen this before when we've used a color down here in the widget tree so it's going to be a background color and we'll say that is going to be equal to data and we still want to evaluate the same variable is daytime and then if that is true then we want it to be a light blue so let's return colors and then dots blue and we'll just leave it as the default blue which is this kind of bright blue right there and then if it's nighttime we'll return instead colors and it will be this time indigo and strength 700 to darken it a little bit so this indigo color it's like a dark blue if you like and that's going to match up with the night image this blue is going to match up with this image so let's apply this background color to the scaffold will say background color and that is going to be colors or rather not colors we just want to use this variable right here so let's pass that in and save it and now we should see that blue color right here if it was night so let's change this again to 15 so 3 o'clock and then run this again we should see the darker color which we do and that goes with this image a bit more okay one more thing I want to do and that is change the colors of all these things over here because at the minute they don't stand out very well against this background first of all let me change this back to 20 and save it then hard or rather hot restart and then let's go back to our home page and this time what we're going to do is come down to first of all the icon over here so we can call it the icon so that looks like a light gray or something like that so let's cut that and go down to the next line and paste it in and the second property inside this icon is going to be the color property and that is going to be colors doc gray and then a light gray so just strength 300 save that and we should see a light icon cool now for the text we need to cut this as well inside the text widget go down and let's now below that add on a color property as well and that will be colors gray and again this will be 300 like so okay my mistake we can't add a color property directly onto the text school by Hera so I'm going to cut that and do a style property first of all and this will be a text style and inside this textile is then when we can add a color so if I save this now should be working fine cool so now we just need to color these two things so let's scroll down and this time we're going to color these white not gray so they stand out a bit more so first of all this one let's say color is going to be colors dots white and if we can spell it and then the same for down here color is going to be colors dots white awesome save that and that is looking a lot better so now everything is looking pretty good the next logical step is to create the location screen which is this thing right here so that we can choose different locations and when we choose one of them eventually we're going to show that location on the home screen so we're going to update this right here so we're going to start to flush out the template of this screen in the next video

# 35 - Flutter Tutorial for Beginners List View Builder
    all rather than so we're making some progress with this app but there's still a couple of things left to do what I'd like to do now is flesh out this page where we choose a location so ultimately what we're going to do is have a load of different locations here a little buttons or cards and when we click on one of those it's going to update the location by creating a new will time class for that location getting the time data returning it to us and then we're going to reroute back to the home screen to show that updated data now it all sounds quite complex but we're going to split it up into little bits and in this video what I want to do is just focus on the template of this page and to do that we're going to use something called a list of view builder which we will see in a minute but first things first we need a bit of data to work with so what I'm going to do is open up the file that we actually need which is inside pages and it's choose location so what I'm going to do is define a bit of data over here but instead of me writing this out from scratch and boring everyone I'm just gonna paste this from my repo so it is just a list and it's a list of world time instances so we're just creating different instances of the world time class here and this variable is called locations now inside each world time instance we have the URL for a different place we have the location which we show in the UI and we also have a flag so these things right here UK dot PNG Greece dot PNG and so forth now we don't have those images at the minute but we will put them in later onto our assets folder for now what I'd like to do is just import this file this world time file inside services so we don't get this red squiggly line and this error because at the minute we couldn't use this because we don't have an import for it so let's go to import and we want the services so let's go to this world time services and then it's world underscore at time dot dot so that is this file right here where we made that class up so now we can use that class inside this file and we no longer get errors right here but anyway now we have all of this data inside a list so what we could do is cycle through this layer and output a bitter template for each item in the list now to do this we'll be using something called the list view builder which is basically going to allow us to use an inline anonymous function to return a widget template for each item inside this list now earlier in the series we used the map method to output a template for items in a list and that was one way of doing it so I'm showing you a different way of doing it this time using the list view builder so to do this first of all inside our scaffold we need a body property and this body property is going to be a list view dot builder now inside this ListView builder we need to specify a couple of properties the first one is the item count so how many items are inside the list that we want to cycle through well I can just say locations which is the variable name of the list dot length and that will get us how many items are inside the list so that's the first piece of information we need to provide the second thing is the item builder which in itself is a function which takes two parameters so the first one is the context object and the second one is the index so this is a function but what's going on here well this list of view builder will use this item build a function now for every single item inside this list so it will cycle through the list and it will then return a widget template or widget tree for each item inside this list now each time we find the function we get access to the index of that item in the list so to begin with its index 0 then 1 then 2 then 3 and so forth so we can use that to actually get data from that specific elements in the list so we need to return a template now for each item inside this list and the way we do that is by saying return and then we're going to return a card template we've seen this in the past and inside this card we need a child property so we'll say child and then this is going to be a list tale now we've not seen list tile yet but let me just go to the docs and give you a quick preview of what this looks like it looks a bit like this where we can have a little item image or thumbnail on the left and then on the right we're going to have a little text label so that's what we're going to do we want some kind of flag icon and then the name of the location so that's why we're using this list tile widget right here so inside this list tile we need a couple of different things first of all we need an on tap function or an untapped property which will be a function and that is going to fire when a user taps this particular location a bit like unpressed so after that we need a title and this is going to be the actual text that's going to show inside this list title so we need a text widget and what do we want to output well we want to output this location property on this particular item so we can say locations which is the list itself then we want to use the index which will be 0 1 2 or 3 or 4 etc so we get that particular item that we're currently iterating and then we want the location property which is either London or Berlin or something else so that's what where I'll put him right here so let me just test this so far but before we do let me just replace this thing with a semicolon because this is the end of a return statement so let's save this and then we can see these tiles right here so that's good we made a start now we can see each one of these items has been output instead of card inside a list tile so now we just need these little flag icons now at the minute we don't have to flag icons in there but I've got a folder on my desktop with all of these flag icons inside them so I'm going to select all of those and by the way you can get these again from my github repo just select the lesson 34 branch from the drop-down and just going to the assets folder to get these so I'm going to grab all of those and I'm going to put them inside assets over here press ok and now we can see all these so now we want to output one of these images next to each one of these so let's do that and we do that using a property inside the list I'll called leading so this is the leading image now we're going to use a circle avatar we've seen this before in one the earlier lessons in the ninja ID card this is like a circle with a background image that will be a picture so inside this circle avatar we need to specify that background image so background image and this is going to be an asset image and inside this we need to specify the path to this particular image that we want to use for this location now we know it's in the assets folder but then how do we know which file we actually want out of these well we store it up here because we enter it in into the flag property so if it's London then we're going to use the UK flag in its Nairobi in Kenya etc so we use this flag property so all we need to do now is use our dollar sign and then curly braces because remember we're going to use square bracket notation and if we use the square bracket notation or duck notation we have to use the curly braces when we output a variable inside a string so I want the locations which is the list itself then the index to get the specific item we're currently iterating and then we want the flag property so let me now save this and cross my fingers and now we can see all of these things right here so now we can see the icon of the flag and the location so that looks pretty good right and that was pretty easy to do using this list of view builder now one more thing I want to do is just add some padding around each card so I think I'm going to surround this with a padding widget so go to add padding over here and we'll say instead of all this is going to be symmetric so symmetric and then inside we want a vertical property which is going to be just one pixel and then horizontal so left and right and that is going to be four pixels okay so save that and now we get a bit more space around those items okay cool so now we have our template sorted but at the minute if we click one of these things nothing is happening yet yeah we have this thing over here let's go to this ontap function and we could even say down here you know print and then we'll just print out the locations and then index and then the location itself just so we can see that this is actually working so save it and then go to run oops we need our semicolon so save it and then go to run and I'm just gonna hard or hot restart and hopefully when we click on one of these things now if we go to edit location then we're gonna see the location print down here so I can click Cairo and we see Cairo Jakarta New York etc so this works but instead of just printing this here what we need to do is then actually get the data at the time for that location using the get time method inside the world time class over here and once we have that time then we can reroute back to the home page with that data and update the home page with that new data so we'll tackle that in the very next tutorial

# 36 - Flutter Tutorial for Beginners Updating the Time
    okay they're my friends so there's only really one more piece to the puzzle when it comes to this up and that is to update the location data whenever we click on one of these things right here because at the minute if I click on Berlin for example the only thing that's happening is that this on top function is firing and we're printing that location but really what we want to do is invoke a function here which we will define up here in a minute we'll say a void function and that function is then going to use the get time method on whatever instance we want to find out the time for so if they clicked on Berlin for example then this one right here we would use the get time method on that world time instance to get that new data then when we have the data will reroute back to the home page and update the home page with that data so it sounds a bit complex but we're going to tackle this one step at a time first of all I'm going to define this void function down here which we'll call update time now we're going to pass through an index into this and this index is going to represent whichever instance of this class we want to call the get time method on because if we click on this one the index is going to be zero this one the index will be zero one two three four etc so this will be an asynchronous function because in here we're going to call the get time method eventually and we need to await that wait till it's done before we then reroute that to the home page so first of all we need to call this function down here so inside the on tap function let's say update time and then we want to pass through the current index that was cycling through which we have because we get that inside the item build a function so we pass through the index right there and then up here we have access to that index now first of all we want to create a local variable which is going to store the instance of whatever world time instance we want to use so we'll say world time because that is the data type and we'll call this instance you can call it what you want know and set this equal to locations which is this list and we need to get a specific item from that using this index so square brackets and passing the index so now we have whatever item that a user clicks on if we click on new york now we have this instance so now we have that instance over here and by the way we're not creating a new instance here all we're doing is storing this instance inside this local variable which has this type so now we have that instance available to us what we can do is say a weight and then instance get time remember we use a weight right here because we want to wait until this is done and this is asynchronous it might take a second or two to do now we want to wait until this is done because down here now we need to navigate to homescreen and we also need to pass whatever data whatever time data we'd get back from this to the homescreen as well as the rest of the data like the location the flag and is daytime remember that property we had it's down here in real time when we create an instance and we get the data back we also set this is day time property right here and we use that to either show the night or the daytime picture so we want to send those bits of data back to the home screen now in the past when we want to reroute we've used navigator dot push named or push replacement named to push that route on or that routes on now we don't want to do that this time we want to pop this one back off because if you remember this is still sitting underneath what we do is when we're on the home screen click on this edit location and that pushes this new page on top of the old one so the old home screen is still sitting underneath we want to now pop this one off that's what this arrow does right here it pops this screen off the stack and it goes back to the underneath route so we want to do the same thing as this arrow is doing and we can do that using the pop method so I can say navigator and then dot pop like so okay so the first thing we need to do is pass in the context and the second thing we need to do is pass in the data that we want to send back to the home page now this time we don't say arguments we don't do that when we're popping your route because now what we're doing is just popping back to the one underneath instead we just pass there lay a map and inside this map we can specify the data so the data is going to be the same as the data that we send from the loading page all of this stuff so all I'm going to do is copy that and paste it in here so I don't have to type it out again because we have the same local variable name and we want the same properties location is instance that location flag instance dot flag time etc so we have all of those properties now heading back to the home page now when we get to the home screen over here at the minute the way we're getting that data is via this model R out of context so that gets was the current route information and then we get the settings and then the arguments now this time around because we're popping something back off we're not actually rebuilding this widget so this actually isn't going to get called so instead what we need to do is find out a way to update this state inside this widget with the data that we get back right here so how does this work well when we pop a route off and we send this information back what we can do is receive this back when we actually push in the first place that sounds weird but just watch me as I do this so when we did this over here this is when we go to that screen now you can think of this whole action of ORS going to this screen and choosing something getting the data back and popping back to this screen you can think of all of that as one big action that takes some time to do and as soon as I say that takes some time to do into my head pops the async keyword so you can think of this as a big asynchronous task where we're going to another screen choosing a location getting data and then popping that screen off and coming back here with data that's all one big asynchronous task and what we could do is in fact pass the await keyword in front of this so now when we're doing all this and which using the data without a waiting for all of this to happen underneath on the home screen and then when we get it back we can store what we receive back in some kind of variable result now we don't really know at this point what we'd be getting back so I'm going to be storing it in a dynamic variable and calling this result so what's gonna happen right here and by the way we need to pass a sink into this function to use a way to remember so what's happening now is we're navigating to this screen of here now we've started this big asynchronous task right of choosing a new location and over here what we're doing is choosing a location we click on one of these and it gets the time for that location and then it pops back to the old route the home screen underneath with this data so as soon as we do this what it's doing is sending all of this data this map right here back to the home screen and it's going to get stored in this result so now inside this result when this is finished and it finishes when we come back to this screen at that point we have the result and we can carry on with some code underneath this because the rest of the code under here is not going to run until we get that result back until we come back to this screen and at that point when we do have the result we can use the data inside this result to update the state of this widget because at the minute we have a data over here a data property on this state it gets overridden down here when we apply these arguments to the data that we get initially when we first build this from the loading screen but still we have this data property on the state and we can use set state to update that with the new data we get back so let's go back to where we get this result and use set state to do that so set state and then inside here we need another function and this function is then going to update all of these different values now what I'm going to do is just update the data as a whole so I'll say data is equal now to a map and I'm going to just apply all the properties as one so I'm going to say that the time property is now going to be equal to result and then the time property we get back because you remember we pass through all of these different so in the results we have access to all of these different things time location flag and his day time so let's go back to the home and let's do the next property which I'm going to say is location and the location is going to be results and then location and then the next one so that's is daytime is daytime and that's going to be equal to result is daytime and then final it we want the flag and that is going to be equal to result and then the flag property alright so basically what we're doing is we're overriding the data that we have on the state which is currently this lot of arguments we're adding that with a new map so we're updating the data now what happens when we call set States well we know at that point it triggers a rebuild so this is going to rerun now that's a problem because when we rerun this then we basically just override the data again so we're updating the data down here and it's updating the data on the state's triggers a rebuild but then what we're doing is overriding the data again with this initial data and we don't want that you know we don't want to go back to the initial data we want to keep what we've just updated with so what we could do here is a little check a ternary operator and we've seen those before so we could say at this point the data is equal to and then whether we check first so data and this is a map right so we can use a map method called is not empty so we're checking right here is not empty on the data if it's not empty then it's going to return true now it's not going to be empty if we use set stay and update it at that point so at that point is not empty so we can return just the data as it is which is the new data we just updated with and if it's not a rather if it is empty it's going to return false here and we return this data does that make sense okay so and by the way throughout all the ways of doing this sing with any kind of technology there's more than one way of a pro in a problem this is just a way that I thought would be easiest for you to understand and learn to begin with so let me save this now and then let me try this out I am gonna cross my fingers because we've added quite a lot of code and I normally like to test as we go on but we kinda need you to do all of this at once so let me go to edit location and change this to Cairo we go back and we can see now the time in Cairo so there we go my friends we have now successfully created this app and we can choose all of these different locations and if you wanted to you could add different locations to this list or extend it in a different way if you do do something like that please leave the link to your projects down below or your github repositories and we'll try and check them out alright they're my friends so that is all unfortunately I really really hope you've enjoyed this beginners course for flutter but there is so much more to flutter than this and what I suggest you do is maybe read the docs and also check out this cookbook on the flutter website for more ideas so I strongly encourage this I'm gonna leave this link down below so you can check it out in your own time and also I will be doing another series or two in the future and maybe create a flutter app with firebase is the back end so stay tuned for that and I might also do another series about testing flutter apps as well unit testing and widget tests in that kind of thing now if you do enjoy these videos and you want to support please like and share the videos I really appreciate that and if you really like them feel free to join a channel by clicking this button right here should also be down below the video it's just 99 pence or cents per month and you get these cool little badges as well but anyway that's it thanks once again for watching really hope you enjoyed it and I'm gonna see you all in the very next series

# 1 - Intro & Setup
##  Flutter 是什麼（Flutter Framework）

* Flutter 是行動端 UI 框架（mobile UI framework）
* 用來開發 iOS 與 Android 原生應用程式（native apps）
* 可存取平台功能 API（platform APIs），如相機（camera）、麥克風（microphone）
* 使用單一程式碼庫（single codebase）開發跨平台應用
* 主要使用 Dart 程式語言（Dart programming language）

##  Flutter 的核心優點（Advantages of Flutter）

* 單一程式碼庫（single codebase）可同時支援 iOS 與 Android
* 修改與維護只需一次更新，不需分平台處理
* 支援響應式版面設計（responsive layout）
* 能適應不同螢幕尺寸與裝置
* 執行效能佳且畫面流暢（performance & smooth UI）
* 可與 Firebase（Firebase backend）良好整合
* 使用 Dart 語言（Dart language），學習門檻相對較低
* 內建 Material Design（Material Design），可快速建立美觀介面
* 官方文件完整（official documentation），方便查詢

##  課程內容結構（Course Structure）

* 前半段學習 Flutter 基礎概念
* 建立簡單範例應用程式（dummy apps）
* 後半段整合所學技術
* 開發世界時間應用程式（world time app）
* 支援城市切換與時間顯示
* 根據時間顯示日夜背景（day/night theme）

##  學習前提（Prerequisites）

* 建議具備基本程式設計能力（programming fundamentals）
* 需理解類別（class）
* 需理解函式（function）
* 需理解變數（variable）
* 需理解非同步程式（asynchronous programming）
* 需理解 API 概念（API）
* 無程式基礎者不建議直接開始 Flutter

##  開發工具選擇（Development Tools）

* 可使用 Android Studio（Android Studio）作為主要開發環境
* 也可使用 VS Code（Visual Studio Code）
* Android Studio 提供 Flutter 外掛支援（Flutter plugins）
* 工具選擇不影響 Flutter 功能本身

##  安裝 Git（Git Installation）

* Git 是版本控制系統（version control system）
* 用於追蹤程式碼變更（track code changes）
* Flutter 安裝流程依賴 Git
* 不一定需要熟悉 Git 使用方式

##  安裝 Flutter SDK（Flutter SDK Installation）

* 使用 Git clone 下載 Flutter SDK（Flutter SDK repository）
* 建議安裝於非系統權限資料夾（non-admin directory）
* 常見安裝位置為 C 槽 source 資料夾
* 使用命令提示字元（Command Prompt）執行安裝指令
* 完成後即可取得 Flutter 原始碼環境

##  Flutter 環境檢查（Environment Verification）

* 使用 flutter doctor 指令（flutter doctor command）
* 檢查 Flutter 與 Dart 安裝狀態
* 檢查 Android Studio 是否正常整合
* 成功狀態會顯示綠色勾勾（success indicators）
* 可確認開發環境是否完整

##  環境變數設定（Environment Path Setup）

* 需將 Flutter 加入系統 PATH（system PATH variable）
* 路徑需包含 flutter/bin
* 設定後才能全域使用 flutter 指令
* 未設定會導致終端機無法辨識 Flutter

##  課程資源取得（Course Resources）

* 所有課程程式碼存放於 GitHub（GitHub repository）
* 每個章節對應一個 branch（branch per lesson）
* 可切換 branch 查看不同課程階段程式碼
* 可使用 git clone 下載完整專案
* 也可直接下載 zip 檔取得原始碼

---
# 2 - Flutter Overview
##  Widget 是 Flutter 的核心概念（Widgets in Flutter）

* Widget（元件）是 Flutter 應用的基本組成單位
* 幾乎所有 UI 內容都是 widget
* 整個 Flutter 應用本質上由 widget 組成
* 沒有 widget 就無法建立 Flutter UI

##  Widget Tree 結構（Widget Tree Structure）

* UI 由 widget 以樹狀結構組成（widget tree）
* 最外層是根 widget（root widget）
* widget 可以層層包覆其他 widget（nesting）
* 常見結構包含 AppBar widget、Text widget、Container widget
* UI 是由多層 widget 嵌套形成整體畫面

##  常見內建 Widgets（Built-in Widgets）

* Text widget 用於顯示文字
* Button widget 用於建立按鈕
* Row widget 用於橫向排列
* Column widget 用於縱向排列
* Image widget 用於顯示圖片
* Container widget 用於版面與區塊控制
* Flutter 提供大量可直接使用的內建 widgets

##  Widget 屬性（Widget Properties）

* 每個 widget 都可以透過 properties 調整外觀與行為
* Text widget 可設定 style、textAlign、overflow、maxLines
* Button widget 可設定 color、elevation、disabledColor、enabled
* properties 用來控制 UI 外觀與互動行為
* 不同 widget 有不同可調整的屬性

##  Widget 的本質（Widgets as Classes）

* 所有 widget 本質上都是 Dart class（Dart class）
* 每個 widget 對應一個 class 定義
* class 控制 widget 的行為與畫面呈現
* UI 其實是 class 的組合結果

##  Flutter 架構概念（Flutter Architecture）

* Flutter UI 完全由 widget tree 組成
* 每個 UI 元素都是 widget instance
* widget 可以重複組合形成複雜介面
* UI 架構是由 widget 層層堆疊而成

##  Dart 與 Flutter（Dart Language in Flutter）

* Flutter 使用 Dart 程式語言（Dart programming language）
* Dart 由 Google 開發
* 支援跨平台開發（mobile、web、desktop）
* 屬於物件導向語言（object-oriented programming）
* 使用 class、function、type 等語法概念

##  Flutter 程式結構概念（Code Structure Overview）

* Flutter 程式主要由 Dart class 組成
* UI 透過 widget tree 建立
* widget 之間以嵌套方式組成畫面
* 每個 widget 可透過 properties 調整行為與外觀
* 程式碼最終轉換為應用畫面 UI

---
# 3 - Dart Primer
##  Dart 與 Flutter 的關係（Dart in Flutter）

* Flutter 使用 Dart（Dart programming language）作為開發語言
* Dart 與 JavaScript、Python 等語言概念相似
* 語法不同但核心邏輯相同（variables、functions、classes）
* 本課程只涵蓋 Flutter 常用 Dart 概念

##  Dart Playground（DartPad）

* DartPad（dartpad.dev）是線上 Dart 執行環境
* 左側為程式碼編輯區（code editor）
* 右側為輸出結果（console output）
* `void main()` 是程式進入點（entry point）
* 執行時會從 main 函式開始運行

##  變數與型別（Variables & Data Types）

* 變數用來儲存資料（store values）
* Dart 是靜態型別語言（statically typed language）
* 變數一旦宣告型別後不能改變
* 常見型別包含 int（整數）、string（字串）、bool（布林值）
* 變數宣告需指定型別、名稱與值

##  dynamic 型別（Dynamic Type）

* dynamic 允許變數改變資料型別
* 行為類似 JavaScript 動態語言
* 使用彈性高但容易產生錯誤
* 實務上通常避免使用

##  函式（Functions）

* 函式用來封裝程式邏輯
* `void` 表示不回傳任何值
* 函式可以回傳指定型別（string、int 等）
* 回傳型別必須與宣告一致
* main 是 Dart 預設執行函式（entry function）

##  Arrow Function（箭頭函式）

* Arrow function 用於簡化函式寫法
* 適用於單行回傳結果
* 使用 `=>` 取代大括號與 return
* 可讓程式碼更簡潔

##  List（清單）

* List 類似 JavaScript array
* 使用 [] 儲存多個值
* 可使用 add 新增元素
* 可使用 remove 移除元素
* 可透過泛型（generics）限制資料型別
* List`<string>` 可確保只存字串

##  類別（Class）

* Class 是建立物件的藍圖（blueprint）
* 用於描述資料與行為
* 包含屬性（properties）與方法（methods）
* 屬性描述資料內容
* 方法描述行為功能

##  物件實例化（Instantiation）

* 使用 class 建立物件稱為實例化
* 每個物件都是 class 的 instance
* 不同 instance 可擁有不同資料
* 透過 class 產生多個獨立物件

##  建構子（Constructor）

* Constructor 用於初始化物件
* 在建立物件時自動執行
* 可接收參數設定初始值
* 使用 this 指向當前物件
* 可讓每個物件擁有不同屬性值

##  繼承（Inheritance）

* 繼承允許 class 擴展其他 class
* 使用 extends 關鍵字
* 子類別可使用父類別功能
* 可新增額外方法或屬性
* super 用於呼叫父類別建構子
* 可建立不同層級的物件結構

---

##  類別（Class）

* 類別（class）在程式語言中是一種物件的藍圖（blueprint）
* 用來描述物件應該包含的資料與行為
* 例如 User 物件可以包含名稱、年齡、自我介紹等資訊
* 也可以用來描述購物車（shopping cart）等結構

##  物件與類別關係（Objects & Classes）

* 類別本身不會直接產生資料
* 類別只是定義規則與結構
* 透過類別可以建立實際物件（object）
* 物件是類別的實例（instance）
* 建立物件的過程稱為實例化（instantiation）

##  建立類別（Creating a Class）

* 使用 class 關鍵字建立類別
* 類別名稱通常使用大寫開頭（convention）
* 大括號內定義屬性與方法
* 屬性用來存資料
* 方法用來定義行為（本質是函式）

##  類別屬性（Properties）

* 屬性用來儲存物件資料
* 例如 username、age 等變數
* 屬性可設定預設值
* 每個物件可以擁有自己的屬性值

##  類別方法（Methods）

* 方法是定義在類別中的函式
* 用來描述物件行為
* 例如 login 方法代表使用者登入行為
* 方法可以透過物件呼叫

##  物件實例化（Instantiation）

* 使用類別名稱建立物件
* 建立後會產生獨立的實例（instance）
* 每個實例彼此獨立
* 可將物件存入變數中使用
* 變數型別為該 class 類型

##  預設值問題（Default Values）

* 若在 class 中直接設定屬性值
* 所有物件都會共享相同預設值
* 會導致所有 instance 行為一致
* 無法建立不同資料的物件

##  建構子（Constructor）

* 建構子在建立物件時自動執行
* 用於初始化物件屬性
* 可以接收外部參數
* 讓每個物件擁有不同資料
* 使用 this 指向當前物件

##  this 關鍵字（this Keyword）

* this 代表當前物件實例
* 用於區分參數與屬性
* 可將外部傳入值指定給物件屬性
* 例如 this.username = username

##  繼承（Inheritance）

* 繼承允許一個類別延伸另一個類別
* 使用 extends 關鍵字
* 子類別會自動擁有父類別的屬性與方法
* 可在子類別中新增額外功能
* 用於重用與擴展程式結構

##  super 關鍵字（super Keyword）

* super 用來呼叫父類別建構子
* 當子類別繼承父類別時必須初始化父類別資料
* 可將參數傳遞給父類別
* 確保繼承結構正確初始化

##  繼承與限制（Inheritance Behavior）

* 子類別可以使用父類別方法
* 但只有子類別可以使用自己新增的方法
* 不同類別實例擁有不同功能集合
* 用於控制功能權限與擴展行為

---
# 4 - Creating a Flutter App in Android Studio
##  Android Studio 與 Flutter 環境設定（Setup Overview）

* 需要先安裝 Android Studio（Android Studio）
* Flutter 需要透過 Android Studio 進行開發與測試整合
* 可以使用 Android Virtual Device（AVD）建立模擬器
* 模擬器（emulator）用來在電腦上模擬 Android 裝置

##  Android 模擬器（Android Emulator / AVD）

* AVD Manager（Android Virtual Device Manager）用來建立虛擬裝置
* 虛擬裝置（virtual device）模擬手機或平板
* 可用於測試 Flutter App，不需要實體手機
* 可選擇不同裝置型號（例如 Nexus 6）
* 需選擇系統映像（system image），例如 Android Pie（API 28）
* 建立完成後即可在 Android Studio 中執行模擬器

##  Flutter 與 Android Studio 外掛（Plugins）

* 需安裝 Flutter plugin（Flutter plugin）
* 同時會安裝 Dart plugin（Dart plugin）作為依賴
* 安裝後可直接建立 Flutter 專案
* 提供 Flutter project 建立選項
* 安裝完成需重啟 IDE（restart IDE）

##  建立 Flutter 專案（Create Flutter Project）

* 選擇 Flutter Application（Flutter application）
* 設定 project name（專案名稱）
* 設定 project location（專案存放位置）
* 可設定 company domain（用於 package identifier）
* 完成後會自動產生 Flutter 專案結構

##  Android Studio 設定（IDE Settings）

* 可使用 dark theme（深色主題）提升可讀性
* 可調整 UI 字體大小（UI font size）
* 可調整程式碼字體大小（editor font size）
* 設定會影響整體開發閱讀體驗

##  Flutter 專案結構（Project Structure）

* android 資料夾：Android 平台相關設定
* ios 資料夾：iOS 平台相關設定
* lib 資料夾：主要程式碼位置（main codebase）
* test 資料夾：測試檔案（testing files）
* pubspec.yaml：專案依賴與設定檔
* 大部分開發集中在 lib 資料夾

##  main.dart（應用入口）

* main.dart 是 Flutter 預設進入點
* main() 函式是程式執行起點（entry point）
* runApp() 用來啟動 Flutter 應用
* 所有 UI 都從 root widget 開始建立

##  Flutter Widget 概念（Widget Tree）

* Flutter UI 完全由 widget 組成
* main.dart 中建立 widget tree（樹狀結構）
* 每個 UI 元素都是 widget
* widget 可以層層嵌套形成畫面

##  MaterialApp（應用基礎框架）

* MaterialApp 是 Flutter Material Design 容器
* 作為應用的 root widget（根 widget）
* 提供 theme、route、home 等設定
* 用於包覆整個應用 UI 結構

##  Home 屬性（Home Property）

* home 定義應用首頁畫面
* 可以指定任何 widget 作為首頁
* 最簡單情況可直接使用 Text widget
* 例如顯示單純文字畫面

##  Text Widget（文字元件）

* Text widget 用於顯示文字內容
* 可以直接傳入字串
* 是最基本的 UI 元件之一
* 可放在 home 或其他 widget 中

##  Hot Reload（熱重載）

* Hot reload 可快速更新 UI
* 不需要重新啟動整個 app
* 用於即時查看程式變更結果
* 是 Flutter 開發的重要功能

##  初始 Flutter App 行為（Default App Behavior）

* 預設 Flutter 專案包含 demo widget tree
* 包含 Scaffold、AppBar、Text、Button 等元件
* 主要用於示範 widget 結構
* 可直接刪除並重新建立 UI

##  Scaffold（基礎頁面結構）

* Scaffold 是頁面基本架構 widget
* 提供 app bar、body、floating action button 等區域
* 用於快速建立標準頁面布局
* 是 Material Design 常用元件

##  FloatingActionButton（浮動按鈕）

* FloatingActionButton 是圓形浮動按鈕
* 常用於主要操作（primary action）
* 通常位於畫面右下角
* 可觸發事件或狀態更新

---
# 5 - Scaffold & AppBar Widgets
##  MaterialApp 與 Home（home property）

* MaterialApp（MaterialApp）是 Flutter App 的根 widget（root widget）
* home property 決定 App 啟動後顯示的畫面
* 目前使用 Text widget（Text）作為最基本畫面內容
* 內容單一且缺乏結構

##  Scaffold 基本佈局（Scaffold widget）

* Scaffold widget（Scaffold）用來建立 App 的基礎畫面結構
* 提供 App 常見區塊如 AppBar、Body、FloatingActionButton
* 是 Flutter 常用的頁面骨架（layout structure）
* 用來快速組裝整體 UI 架構

##  App Bar 設定（AppBar widget）

* AppBar widget（AppBar）用於建立頂部工具列
* title property 用來設定標題內容
* 標題必須使用 Text widget（Text）包住字串
* centerTitle property（centerTitle）可將標題置中
* 預設在 Android 上為左對齊

##  Body 內容與置中（Center widget）

* body property 用來顯示主要畫面內容
* Text widget（Text）可用來顯示文字
* Center widget（Center）可將內容置中顯示
* child property（child）用來嵌入子 widget
* 透過 Center 包住 Text 來達到置中效果

##  浮動按鈕（Floating Action Button）

* FloatingActionButton widget（FloatingActionButton）用於建立浮動按鈕
* 位置通常在畫面右下角
* child property 用來放入按鈕內的內容
* 可使用 Text widget（Text）顯示文字
* onPressed（onPressed）用來處理點擊事件，目前未設定

##  Widget 巢狀結構（Widget Tree）

* Flutter UI 是由 widget tree（Widget Tree）組成
* widget 可以層層嵌套（nesting）
* property 的值可以是 widget
* 每個 widget 可以再包含更多 widget 與 property
* 用來組合完整 UI 結構

##  Hot Reload 與 Hot Restart

* Hot Reload（Hot Reload）用於快速更新 UI 變更
* Hot Restart（Hot Restart）會重新啟動整個 App
* 用來即時查看畫面修改結果
* 開發過程中常用工具

##  Scaffold 常見屬性（Properties）

* appBar（appBar）用於設定頂部工具列
* body（body）用於設定主要內容區
* floatingActionButton（floatingActionButton）用於設定浮動按鈕
* backgroundColor（backgroundColor）可設定背景顏色
* 提供 App 基本頁面結構配置

---
# 6 - Colours & Fonts

## Material Design 預設樣式與顏色（Material Design）

* Flutter 使用 Material Design（Material Design）作為預設 UI 風格
* 預設包含藍色主題、預設字體與字級
* 可透過 Material color palette（Material Color Palette）自訂顏色

## AppBar 顏色設定（AppBar backgroundColor）

* AppBar widget（AppBar）可使用 backgroundColor（backgroundColor）
* 顏色透過 Colors 類別（Colors）存取
* 可使用色階（shade，例如 600）調整深淺
* 例如 Colors.red[600] 代表特定紅色層級

## FloatingActionButton 顏色設定

* FloatingActionButton widget（FloatingActionButton）支援 backgroundColor
* 使用 Colors.red[600] 等方式設定顏色
* onPressed（onPressed）為必填參數，用於點擊事件
* child property 可放入 Text widget（Text）

## Text 樣式設定（TextStyle）

* Text widget（Text）可透過 style property 客製化
* TextStyle widget（TextStyle）用於文字樣式控制
* fontSize（fontSize）設定字體大小
* fontWeight（fontWeight）設定粗體（FontWeight.bold）
* letterSpacing（letterSpacing）調整字距
* color（color）可使用 Colors.grey[600] 等顏色

## 自訂字型（Custom Fonts）

* 可從 Google Fonts（Google Fonts）下載字型
* 將字型加入 fonts 資料夾
* 在 pubspec.yaml（pubspec.yaml）中註冊 fonts
* family 用來定義字型名稱（font family）
* TextStyle 使用 fontFamily（fontFamily）套用字型

# 7 - Stateless Widgets & Hot Reload

## Hot Reload 與 Hot Restart

* Hot Reload（Hot Reload）可即時更新 UI 變更
* Hot Restart（Hot Restart）會重啟整個 App
* Hot Reload 不會重置狀態（state）
* Hot Restart 會重置所有狀態
* 開發時 Hot Reload 更有效率

## Stateless Widget 基本概念（StatelessWidget）

* StatelessWidget（StatelessWidget）代表無狀態 widget
* state（狀態）不可變更（immutable）
* 用於靜態 UI 畫面
* 必須實作 build method（build）
* build 回傳 widget tree（Widget Tree）

## Stateful vs Stateless Widget

* Stateless widget（StatelessWidget）內容固定不變
* Stateful widget（StatefulWidget）內容可動態改變
* Stateful widget 適合需要更新資料的 UI
* Stateless widget 適合靜態畫面結構

## 自訂 Widget 與重用性（Custom Widget）

* 可建立自訂 widget class（Custom Widget Class）
* 提升程式碼重用性（reusability）
* 避免重複撰寫 UI（DRY principle）
* widget 可在多個畫面重複使用

## build 方法與 override（@override）

* build method（build）負責建立 UI
* @override（@override）表示覆寫父類別方法
* StatelessWidget 內建 build method
* 自訂 widget 必須覆寫 build
* Flutter 透過 build 更新畫面

---
# 9 - Images & Assets

## 圖片類型（Images in Flutter）

* Flutter 提供兩種圖片來源方式（Image widget）
* 網路圖片（Network Image）
* 本地資源圖片（Asset Image）
* Image widget（Image）用來顯示圖片

## 網路圖片（Network Image）

* 使用 Image.network（Image.network）
* 透過 URL 載入遠端圖片
* 圖片來源需來自網路（例如 Unsplash）
* 不需要額外設定 assets

## 本地圖片（Asset Image）

* 使用 Image.asset（Image.asset）
* 圖片存放在專案 assets 資料夾
* 需手動建立 assets 資料夾
* 必須在 pubspec.yaml（pubspec.yaml）註冊 assets

## pubspec.yaml 設定（Assets）

* pubspec.yaml（pubspec.yaml）用來管理資源
* 需加入 assets 路徑設定
* 可指定單一檔案或整個資料夾
* 修改後需執行 dependencies 更新（get dependencies）

## Image 快捷寫法

* Image.asset（Image.asset）為本地圖片快捷方式
* Image.network（Image.network）為網路圖片快捷方式
* 不需要手動建立 Image + provider 結構
* 提升開發效率

# 10 - Buttons & Icons

## Icons 使用（Icon widget）

* Icon widget（Icon）用於顯示圖示
* 使用 Material Icons（Material Icons）圖示庫
* 透過 Icons 類別（Icons）存取圖示名稱
* 例如 Icons.airport_shuttle

## Icon 客製化

* color（color）可改變圖示顏色
* size（size）可調整圖示大小
* 支援 Material Design 樣式控制

## 按鈕種類（Buttons）

* RaisedButton（RaisedButton）有陰影效果（較舊）
* FlatButton（FlatButton）無陰影效果（較舊）
* ElevatedButton（新版本替代 RaisedButton）
* 用於使用者互動操作

## onPressed 事件（onPressed）

* onPressed（onPressed）處理點擊事件
* 必須提供 function（函式）
* 可使用匿名函式（anonymous function）
* 可用 print 輸出到 console

## IconButton（IconButton）

* IconButton widget（IconButton）為可點擊圖示
* 本質是 Icon + Button 組合
* 必須提供 onPressed
* icon property 設定圖示
* 適合簡潔操作 UI

## Icon + Text 按鈕

* Button.icon（圖示 + 文字按鈕）
* icon property 放 Icon widget
* label property 放 Text widget
* 適合「圖示 + 文字」操作按鈕

# 11 - Containers & Padding

## Container 基本概念（Container widget）

* Container widget（Container）用於包裹其他 widget
* 可視為 UI 容器（wrapper）
* 可設定背景顏色（color）
* 沒有 child 時會撐滿整個畫面
* 有 child 時大小依內容縮放

## child 行為（child behavior）

* child property（child）決定內容
* 無 child → container 填滿空間
* 有 child → container 依內容縮小
* 影響整體 layout 結構

## Padding（內距）

* Padding（padding）控制內部空間
* 使用 EdgeInsets（EdgeInsets）設定
* EdgeInsets.all（EdgeInsets.all）四邊一致
* EdgeInsets.symmetric（EdgeInsets.symmetric）水平與垂直分開
* EdgeInsets.fromLTRB（EdgeInsets.fromLTRB）四邊獨立設定

## Margin（外距）

* Margin（margin）控制外部空間
* 影響 widget 與外部距離
* 使用 EdgeInsets 設定方式相同
* 與 padding 功能不同（內 vs 外）

## Container vs Padding widget

* Container widget（Container）支援 color / padding / margin
* Padding widget（Padding）只提供內距功能
* Padding widget 無法設定背景顏色
* Container 功能較完整
* Padding widget 更輕量適合單純間距

---
# 12 - Rows（Row widget）

## Row 基本概念（Row widget）

* Row widget（Row）用來將多個 widget 水平排列
* 類似 CSS Flexbox / Grid 的橫向排列方式
* 一個 Row 可以包含多個子 widget
* 適合橫向 UI 排版

## children 屬性（children）

* Row 使用 children（children）而不是 child
* children 是一個 widget 清單（List of Widgets）
* 允許同時放入多個 widget
* 每個 widget 用逗號分隔

## Row 內可放多種 widget

* 可放 Text widget（Text）
* 可放 Button widget（Button）
* 可放 Container widget（Container）
* 不同 widget 可混合排列在同一 Row

## 主軸對齊（MainAxisAlignment）

* MainAxisAlignment（main axis alignment）控制「水平排列」
* Row 的 main axis 是「水平」
* start：靠左排列（預設）
* center：置中排列
* end：靠右排列
* spaceBetween：兩端貼齊，中間平均分配
* spaceEvenly：均勻分配間距（含邊緣）
* spaceAround：間距圍繞元素（邊緣較小）

## 交叉軸對齊（CrossAxisAlignment）

* CrossAxisAlignment（cross axis alignment）控制「垂直方向」
* Row 的 cross axis 是「垂直」
* start：靠上對齊
* center：垂直置中（預設）
* end：靠下對齊
* stretch：撐滿可用高度

---

# 13 - Columns（Column widget）

## Column 基本概念（Column widget）

* Column widget（Column）用來垂直排列 widget
* 與 Row 相反（由上到下）
* 類似直向 Flexbox 排版

## children 屬性（children）

* Column 同樣使用 children（children）
* 可放多個 widget
* widget 由上到下排列

## 主軸對齊（MainAxisAlignment）

* Column 的 main axis 是「垂直方向」
* start：靠上排列（預設）
* center：垂直置中
* end：靠下排列
* spaceBetween：上下分散
* spaceEvenly：均勻分布間距
* spaceAround：上下間距平均分布

## 交叉軸對齊（CrossAxisAlignment）

* Column 的 cross axis 是「水平方向」
* start：靠左對齊
* center：水平置中（預設）
* end：靠右對齊
* stretch：橫向填滿寬度

## Row 與 Column 混用

* Row 可以放在 Column 內
* Column 也可以放在 Row 內
* 可建立複雜 UI 結構
* 常用於多層排版設計

---

# 14 - Flutter Outline & Shortcuts

## Widget Action Menu（快速操作）

* 每個 widget 有 Action Menu（燈泡圖示）
* 可快速進行 UI 操作
* move up / move down（移動 widget 順序）
* wrap with widget（包裝 widget）
* add padding（快速加入 Padding）
* replace widget（替換 widget）

## Wrap 與結構修改

* wrap with Row（包成 Row）
* wrap with Column（包成 Column）
* wrap with Container（包成 Container）
* wrap with Center（包成 Center）
* 可快速改變 widget 結構

## Replace widget（替換功能）

* replace with children（用 child 取代）
* 可移除外層 widget
* 保留內部內容

## Flutter Outline（Widget Tree 視圖）

* Flutter Outline 顯示 widget tree 結構
* 可視化 UI 層級關係
* 點選 widget 可直接定位程式碼
* 可快速選取與操作 widget

## 快捷工具列（Outline Toolbar）

* 提供快速 wrap 功能（Row / Column / Center）
* 提供 add padding 快捷按鈕
* 提供 move up / move down
* 提升 UI 編輯效率

---
# 15 - Expanded Widget

## Expanded 的基本用途

* 用於 Row（Row）或 Column（Column）中
* 讓子元件（child widget）填滿可用空間
* 行為類似 CSS Flexbox（flexbox）

## 空間分配方式

* 沒有 Expanded → 依內容大小顯示
* 使用 Expanded → 強制佔用剩餘空間
* 多個 Expanded → 平均分配空間

## Flex 比例（Flex property）

* 用 flex 控制空間比例
* 整體空間會被切成總 flex 的比例
* 例如 3:2:1 → 分別佔 3/6、2/6、1/6

## Flex 實際效果

* flex 越大 → 佔越多空間
* flex = 1 → 預設平均分配
* 可用來做不同比例的版面設計

## Image 搭配 Expanded

* 圖片過大會超出畫面
* 使用 Expanded 限制圖片寬度
* 可避免 UI overflow（溢出問題）
* 搭配 flex 控制圖片比例

---

# 16 - Ninja ID Project

## 專案初始化（Project Setup）

* 建立 Flutter Application 專案
* 設定專案名稱（ninja_id）
* 設定 package name（company domain）
* 移除測試資料夾（test folder）
* 清除預設範例程式碼

## 基本架構（Main Structure）

* 使用 MaterialApp（MaterialApp）作為根 widget
* 使用 Scaffold（Scaffold）建立頁面結構
* home 指向自訂 widget（NinjaCard）

## AppBar 設定

* 顯示標題 Ninja ID Card
* centerTitle → 置中標題
* backgroundColor → 深灰色主題
* elevation = 0 → 移除陰影（flat design）

## Body 與版面設計

* 使用 Column（Column）垂直排列內容
* 外層加 Padding（Padding）控制邊距
* 使用 EdgeInsets 設定上下左右間距

## Text 與樣式（Text Styling）

* 顯示 NAME 與實際名稱
* 使用 TextStyle（TextStyle）設定樣式
* letterSpacing 增加字距
* fontSize 控制大小
* fontWeight: bold 強調文字
* color 使用灰色或 amber

## SizedBox 間距控制

* 使用 SizedBox（SizedBox）製造空白間距
* height 控制垂直間距
* 用於區隔不同資訊區塊

## Row 與 Icon + Text

* 使用 Row（Row）水平排列 icon 與文字
* Icon（Icon）顯示 email icon
* SizedBox(width) 控制水平間距
* email 顯示聯絡資訊

## CircleAvatar 頭像

* 使用 CircleAvatar（CircleAvatar）顯示圓形圖片
* 使用 AssetImage（AssetImage）載入本地圖片
* radius 控制大小
* 放置於 Column 最上方
* 可用 Center（Center）置中

## Divider 分隔線

* 使用 Divider（Divider）分隔內容區塊
* height 控制間距
* color 設定線條顏色
* 用於視覺分區

## 整體版面結構

* 頭像（CircleAvatar）
* 名稱資訊（Text）
* Ninja 等級（Text）
* Email Row（Icon + Text）
* Divider 區隔
* Column 垂直排列完成卡片布局

# 17 - Stateful Widgets

## Stateless 與 Stateful 的差異

* Stateless Widget（Stateless Widget）不會隨時間改變
* Stateful Widget（Stateful Widget）可以隨時間或互動改變狀態
* Stateless 適合靜態 UI
* Stateful 適合動態資料或互動 UI

## State 的概念（State）

* State 是會變動的資料
* 例如：數字、顏色、文字內容
* 當 state 改變時 UI 會重新更新（rebuild）

## Stateful Widget 結構

* Stateful Widget 會產生兩個 class
* 第一個：StatefulWidget 本體
* 第二個：State（State object）

## createState 與 State 連結

* createState() 用來建立 State 物件
* State 物件負責儲存資料與 UI 更新
* Widget 與 State 是綁定關係

## build 方法（build method）

* build() 回傳 UI widget tree
* State 改變時會重新執行 build
* UI 依據最新 state 更新

## 動態資料範例（Counter）

* 定義 int 變數（例如 ninjaLevel）
* 初始值可設定為 0
* UI 使用 $變數 顯示內容（String interpolation）

## setState（setState）

* 更新 state 的唯一方式
* setState 內修改資料
* 會觸發 rebuild（重新建構 UI）

## FloatingActionButton（FloatingActionButton）

* 用於觸發動作的按鈕
* onPressed 事件用來改變 state
* 常用於增加數值或觸發更新

## UI 更新流程

* 按下按鈕 → 呼叫 setState
* 修改資料（例如 +1）
* build 重新執行
* UI 顯示新資料

---

# 18 - Lists of Data

## Stateful Widget 用於資料列表

* 因為資料會變動，所以使用 Stateful Widget
* 適合處理 list（列表）資料

## List（List）

* 使用 List<String>
* 儲存多筆資料（例如 quotes）
* 可動態生成 UI

## map 方法（map function）

* 用於遍歷 list
* 每一筆資料執行一次 callback function
* 類似 JavaScript map

## 動態生成 Widget

* 每個 list item 轉成 widget（例如 Text）
* return Text(quote)
* 避免手動寫多個 widget

## toList（toList）

* map 回傳 Iterable（可迭代物件）
* children 需要 List
* 使用 toList() 轉換

## Arrow Function（Arrow Function）

* 簡化寫法
* 直接回傳 widget
* 適合單行 return

## UI 動態生成流程

* 取得 list data
* map 每個 item
* 轉換成 widget
* 組成 list 回傳給 Column children

## Column + 動態資料

* Column 使用 children list
* 每個 list item 對應一個 UI 元素
* 可擴展成大量資料列表（如 quotes）

---
# 18 - Custom Classes

## 為什麼需要自訂類別

* 避免使用多個 List 分開管理資料造成對應錯誤
* 將相關資料（如 quote 與 author）封裝成單一結構
* 提升程式可讀性與維護性
* 導入物件導向設計（Object-Oriented Design）

## 類別（Class）的概念

* 類別是物件的藍圖（Blueprint）
* 用來描述資料應該包含哪些屬性與行為
* 例如 Quote 類別代表一則引用資料

## 屬性（Properties）

* 用來儲存物件的資料
* 每個 Quote 包含 text 與 author
* 使用 String 型別儲存文字內容

## 建構子（Constructor）

* 用於建立物件時初始化資料
* 與類別名稱相同
* 物件建立時會自動執行

## this 關鍵字

* 指向目前物件本身
* 用來將參數值指定給屬性
* 例如 this.text = text

## 命名參數（Named Parameters）

* 使用 {} 包住參數
* 呼叫時可指定參數名稱
* 不受參數順序影響
* 提升可讀性與彈性

## 物件實例（Instance）

* 使用類別建立實際資料
* 每個 Quote 是獨立物件
* 包含自己的 text 與 author

## List 改為物件集合

* 從 List<String> 改為 List<Quote>
* 每個元素代表完整資料結構
* 避免資料分散與錯位問題

---

# 19 - Cards

## Card Widget 的用途

* 用於包裝內容成卡片樣式
* 提供陰影與邊框效果
* 常用於列表資料呈現

## Margin（外距）

* 控制卡片與外部間距
* 使用 EdgeInsets 設定四個方向
* 增加畫面留白與層次感

## Column 排版

* 用於垂直排列 widget
* 同時顯示 quote 與 author
* children 存放多個元件

## Text Widget

* 顯示 quote.text
* 顯示 quote.author
* 直接存取物件屬性

## TextStyle（文字樣式）

* 控制字體大小（fontSize）
* 控制文字顏色（color）
* 區分主要與次要文字

## SizedBox 間距

* 用於控制元件間距
* 設定固定高度（height）
* 分隔 text 與 author

## Widget 函式化

* 將 Card UI 包成函式
* 回傳 Widget（Widget return）
* 提升重用性與結構清晰度

## List 動態生成 UI

* 使用迴圈或 map 處理 List<Quote>
* 每個 Quote 產生一個 Card
* 動態建立 widget tree

## CrossAxisAlignment（交叉軸對齊）

* 控制 Column 水平對齊方式
* 使用 stretch 讓元件撐滿寬度
* 改善版面整齊度

## Padding（內距）

* 增加卡片內部空間
* 避免內容貼邊
* 提升閱讀體驗

---
# 21 - Extracting Widgets

## 為什麼要抽離 Widget

* 避免在同一個檔案中堆積過多 UI 邏輯
* 提升程式模組化（Modularization）與可重用性（Reusability）
* 讓 UI 結構更清晰、容易維護
* 將「卡片模板」變成可重複使用的元件

## Extract Widget 功能（IDE 工具）

* 使用 Flutter IDE 的 Extract Widget 功能
* 將現有 widget 區塊轉換為獨立類別
* 自動產生 StatelessWidget（無狀態元件）
* 例如將 Card 轉成 QuoteCard widget

## StatelessWidget 概念

* 無狀態元件（StatelessWidget）
* UI 不會隨時間改變
* 適合顯示固定或純輸入資料的畫面
* 使用 build 方法回傳 UI

## 傳遞資料（Constructor & Parameters）

* 透過建構子傳入資料（Constructor Injection）
* 使用 named parameters（命名參數）
* 將 quote 傳入 QuoteCard
* 在 widget 內建立 final 變數保存資料

## final 關鍵字

* 表示變數不可改變
* StatelessWidget 中資料必須是 immutable
* 確保 UI 安全與一致性

## 將 UI 模板變成 Widget

* 原本 function 轉為 class widget
* quoteTemplate → QuoteCard
* UI 結構封裝在 build 方法中
* 提升可重用性與清晰度

## 移除中介 function

* 不再需要額外 template function
* 直接使用 QuoteCard widget
* 減少冗餘程式碼

## 檔案拆分（Separation of Files）

* 將 QuoteCard 移到獨立檔案
* 使用 quote_card.dart
* 提升專案結構清晰度

## import 使用方式

* 使用 relative import 或 package import
* package import 更推薦
* 不需要寫 lib 路徑
* 提升跨檔案可維護性

---

# 22 - Functions as Parameters

## 為什麼需要函式傳遞

* StatelessWidget 無法直接修改資料
* UI 與資料操作需分離
* 將行為（behavior）從父層傳入子元件

## 函式作為參數（Function as Parameter）

* 將 delete function 傳入 QuoteCard
* Widget 不負責資料修改
* 只負責「觸發行為」

## setState 概念

* 用於更新 UI 狀態（State）
* 必須在 StatefulWidget 中使用
* 當資料改變時重新 build UI

## 刪除資料邏輯

* 使用 list.remove() 移除指定 quote
* 傳入目前 quote 作為刪除目標
* 在父層執行資料更新

## onPressed 事件

* 按鈕點擊觸發 callback function
* 呼叫傳入的 delete function
* UI 與邏輯解耦（Decoupling）

## 函式傳遞流程

* 父層定義 delete function
* 傳入 QuoteCard
* 子元件觸發 function
* 父層執行 setState 更新資料

## UI 即時更新

* 刪除後觸發 rebuild
* list 重新 map 生成 widget
* UI 自動同步資料變化

---

# 23 - Starting the World Time App

## 新專案建立

* 建立 Flutter application
* 命名為 world_time
* 移除 test folder（簡化專案）

## 專案結構設計

* 建立 pages 資料夾
* 分離不同畫面（Screens）
* 提升專案組織性

## 三個主要頁面

* loading screen（載入畫面）
* home screen（主畫面）
* choose location screen（選擇地點）

## StatefulWidget 使用

* 三個頁面皆使用 StatefulWidget
* 因為未來會有動態資料更新
* 可管理狀態（State Management）

## Scaffold 架構

* 每個頁面使用 Scaffold
* 提供基本 UI 結構
* 包含 body 區域

## SafeArea Widget

* 避免內容被狀態列遮住
* 自動調整安全顯示區域
* 常用於無 AppBar 的畫面

## 路由與頁面引用（Import）

* 使用 package import 方式
* 提升可維護性與一致性
* 不需寫完整 lib 路徑

## 檔案拆分與模組化

* 每個頁面獨立 dart 檔
* home / loading / choose_location 分離
* 提升專案擴展性

## UI 佔位設計（Placeholder UI）

* 使用簡單 Text 顯示頁面名稱
* 先建立結構再補功能
* 適合逐步開發大型應用

---
# 24 - Maps & Routing

## Map（Dart Map）概念

* Map 是鍵值對（key-value pair）資料結構
* 類似 JavaScript 物件或 Python dictionary
* 用來儲存有結構的資料

## Map 結構與寫法

* 使用 Map<型別, 型別> 定義
* 使用 {} 建立內容
* key 對應 value，例如 name → Sean

## Map 資料存取方式

* 使用中括號 [] 搭配 key 取值
* 例如 student["name"]
* 例如 student["age"]

## Map 與 Routing 的關聯

* Flutter routing 使用 Map 來管理路由
* key 代表路由名稱（route name）
* value 代表對應的 widget builder function

---

## Flutter Routing 基本概念

* routing 用於控制不同畫面之間的切換
* 每個 route 對應一個畫面（widget）
* 在 MaterialApp 中設定 routes

## routes Map 結構

* key 是 route path，例如 /home
* value 是 function (context) => Widget
* context 用來取得 widget 在樹中的位置

## initialRoute（初始路由）

* 指定 app 啟動時第一個畫面
* 可取代 home 屬性
* 用於控制啟動畫面

## home 與 initialRoute 衝突

* home 與 initialRoute 不能同時有效
* 兩者同時存在會造成衝突
* 需選擇其中一種方式

---

## Navigator.pushNamed（頁面跳轉）

* 用於切換到另一個 route
* push = 將新畫面疊在 stack 上
* named = 使用 route 名稱

## Navigator.pop（返回畫面）

* 移除目前畫面
* 回到上一個 route
* 操作 stack 移除最上層畫面

## 路由堆疊（Navigation Stack）

* 每次 push 都會新增一層畫面
* 每次 pop 都會移除最上層畫面
* App 以 stack 結構管理畫面

## AppBar 返回按鈕

* 自動產生返回箭頭
* 觸發 pop 行為
* 回到上一個畫面

---

# 25 - Widget Lifecycle

## StatelessWidget 特性

* 無狀態 widget
* build 只執行一次
* 不會隨資料變化更新

## StatefulWidget 特性

* 有狀態 widget
* 可使用 setState 更新 UI
* state 改變會觸發 rebuild

---

## initState（初始化）

* widget 建立時只執行一次
* 用於初始化資料
* 常用於 API 請求或訂閱資料
* 需呼叫 super.initState()

## build（建構 UI）

* 建立 widget UI 結構
* setState 會觸發 rebuild
* UI 更新核心方法

## dispose（釋放資源）

* widget 被移除時執行
* 用於清理資源
* 避免 memory leak

---

## setState（狀態更新）

* 更新 state 並觸發 UI 重建
* 只能在 StatefulWidget 使用
* 改變資料後重新執行 build

## 狀態更新流程

* 呼叫 setState
* 修改變數（例如 counter）
* Flutter 重新執行 build
* UI 更新畫面

---

## counter 範例概念

* 宣告 counter = 0
* 點擊按鈕增加數值
* UI 即時更新顯示結果

## 生命週期整體概念

* initState 用於初始化
* build 用於畫面渲染
* dispose 用於資源清理

---
# 26 - Asynchronous Code

## 什麼是非同步（Asynchronous）

* 代表「現在開始執行，但未來才完成」的操作
* 常見於 API 請求或資料庫查詢
* 不會阻塞（Non-blocking）主程式執行
* 在等待期間，其他程式仍可繼續運行

## Future（未來結果）

* Dart 中的非同步資料型別
* 類似 JavaScript Promise
* 代表「未來會回傳的值」

## Future.delayed（延遲模擬）

* 用來模擬網路請求時間
* 使用 Duration 設定延遲時間
* 例如等待 3 秒後執行 callback

## 非同步函式（async function）

* 使用 async 標記函式
* 表示該函式內部包含非同步操作
* 允許使用 await

## await 關鍵字

* 等待 Future 完成後才繼續執行
* 會暫停當前函式流程
* 不會影響其他程式執行

## 非同步流程行為

* 沒有 await → 程式直接往下跑
* 有 await → 必須等結果回傳
* 可控制執行順序

## 非同步資料依賴

* 若第二個請求依賴第一個結果
* 必須使用 await 等待完成
* 避免使用未完成資料

## async + await 組合

* async：宣告非同步函式
* await：等待 Future 結果
* 兩者搭配控制流程順序

---

# 27 - Packages & HTTP

## 什麼是 Flutter 套件（Package）

* 已封裝好的功能模組
* 由其他開發者提供
* 可直接使用避免重複造輪子
* 用於擴充 Flutter 功能

## pub.dev（套件來源）

* Flutter 官方套件網站
* 提供各種 package 搜尋與下載
* 可查看版本與評分

## HTTP 套件（http package）

* 用於發送網路請求
* 支援 GET / POST 等 API 操作
* 常用於取得外部資料

## 安裝套件方式

* 在 pubspec.yaml 加入 dependency
* 使用 flutter pub get 安裝
* 系統自動下載套件

## HTTP GET 請求

* 用來取得 API 資料
* 需提供 endpoint URL
* 回傳 Response 物件

## Response（回應物件）

* 包含 API 回傳結果
* body 屬性存放資料內容
* 通常為 JSON 字串

## JSON（JavaScript Object Notation）

* 常見資料交換格式
* 外觀類似 Map / Object
* 但本質是字串

## JSON decode

* 將 JSON 字串轉換為 Map
* 使用 dart:convert 套件
* 轉換後才能存取 key-value

## Map 資料存取

* 使用 [] 存取 key
* 例如 data["title"]
* 可直接取得 API 資料欄位

## 非同步 HTTP 流程

* 發送 request（get）
* 等待 response（await）
* 取得 body（JSON 字串）
* decode 成 Map
* 存取資料使用

## 非同步 + API 概念整合

* async 用於 API 呼叫
* await 等待伺服器回應
* HTTP 套件負責發送請求
* JSON 負責資料格式轉換

---
# 28 - World Time API

## 使用世界時間 API（World Time API）

* 使用免費世界時間 API（World Time API）取得各地時間資料
* API 透過不同時區（time zone）端點查詢指定城市時間
* 以 London 等城市為例測試 API 回傳結果
* 回傳資料可使用 JSON（JSON format）或純文字（plain text）
* 主要關鍵資訊包含日期時間（dateTime）與時區偏移（utc_offset）

## HTTP 請求與資料解析

* 使用 HTTP GET 請求（HTTP GET request）向 API 取得資料
* 將回傳字串使用 JSON decode（JSON decode）轉為 Map 結構
* 從 Map 中取出 dateTime 與 utc_offset 欄位
* 使用 print 輸出結果確認 API 回傳內容正確

## 時間資料轉換與處理

* 將 dateTime 字串轉換為 DateTime 物件（DateTime object）
* 使用 DateTime.parse 解析時間字串
* 使用 Duration（時間間隔）概念處理時區差異
* 將 utc_offset 字串轉為可計算數值
* 使用 DateTime.add() 修正實際本地時間
* 使用 substring 去除 offset 字串中的符號

## 除錯與開發流程

* 逐步輸出 API 回傳資料進行除錯（debug）
* 發現欄位名稱錯誤導致 null 值問題
* 使用 hot restart 測試修改結果
* 即時修正避免後續邏輯錯誤擴大

---

# 29 - WorldTime Custom Class

## 建立服務層架構（Service Layer）

* 建立 services 資料夾整理 API 邏輯
* 將時間相關功能抽離成 WorldTime 類別（WorldTime class）
* 提升程式碼可重用性（reusability）
* 減少 UI widget 中的邏輯複雜度

## WorldTime 類別設計

* 定義 location（地點名稱）、time（時間）、flag（國旗）、url（API endpoint）屬性
* 使用建構子（constructor）傳入初始化參數
* 使用 named parameters（命名參數）進行屬性設定
* location 用於 UI 顯示名稱
* flag 用於顯示國旗圖片路徑

## 封裝 API 邏輯

* 將 getTime() 方法移入 WorldTime 類別
* 使用 HTTP GET request 呼叫 API
* 使用 JSON decode 解析資料
* 將處理後時間存入 time 屬性
* 使用 toString() 將 DateTime 轉為字串

## 非同步處理（Async / Await）

* 使用 async/await 處理非同步 API 請求
* 方法回傳 Future（Future / Promise 概念）
* 使用 await 等待 API 完成後再執行後續程式
* Future 代表尚未完成但未來會回傳結果的值

## 時區處理與時間修正

* 使用 substring 移除 offset 字串符號
* 使用 int.parse 將字串轉為整數
* 使用 Duration(hours) 表示時差
* 使用 DateTime.add() 加上時區偏移
* 修正 API 時間與本地時間差異

## UI 狀態更新與顯示

* 使用 StatefulWidget 管理 loading 狀態
* 初始顯示 loading 文字
* 使用 setState 更新 UI 狀態
* 將 instance.time 更新到畫面顯示
* UI 在 setState 後自動重新渲染（rebuild）

## 模組化使用流程

* 在 loading 畫面建立 WorldTime instance
* 呼叫 getTime() 取得時間資料
* 等待 Future 完成後取得 time 屬性
* 將結果更新至 UI 顯示
* 為未來城市切換功能做結構準備

---
# 30 - Error Handling

## API 錯誤來源與問題情境

* API endpoint（API 端點）可能因拼字錯誤導致請求失敗
* URL 不正確會造成 HTTP request（HTTP 請求）失敗
* JSON decode（JSON 解析）可能因回傳格式錯誤而崩潰
* 後續 DateTime 轉換與資料處理會連鎖失敗
* UI 會卡在 loading 狀態無法更新
* console（控制台）會出現錯誤訊息

## 使用 try / catch 錯誤處理（Error Handling）

* 使用 try-catch block（例外處理區塊）包住可能出錯的程式碼
* try 區塊放入 API 請求與資料解析邏輯
* catch 區塊捕捉 error（錯誤物件）
* 使用 print 輸出錯誤資訊以便除錯
* 避免應用程式因錯誤直接崩潰

## 錯誤發生時的狀態問題

* 發生錯誤時 time 變數可能未被設定（null）
* UI 使用 null 值會導致 runtime error（執行時錯誤）
* loading 畫面會卡住無法更新
* setState 更新時可能帶入錯誤資料

## 錯誤時的替代資料處理

* 在 catch 區塊中設定 fallback value（備用值）
* 將 time 設為錯誤提示字串，例如：

  * could not get time data
* 避免 UI 顯示紅色錯誤畫面（red screen of death）
* 確保使用者仍能看到可理解訊息

## 錯誤修正後的流程變化

* 發生錯誤 → 進入 catch 區塊
* 不再執行正常資料解析流程
* 直接更新 UI 顯示錯誤訊息
* console 同時輸出錯誤原因

---

# 31 - Passing Route Data

## Loading 畫面角色調整

* loading screen 僅負責取得資料
* 不再負責顯示時間內容
* 成功取得資料後導向 home page（首頁）
* 移除不必要的 UI 狀態管理

## 路由跳轉（Navigation）方式

* 使用 Navigator.pushNamed（路由跳轉）
* 改用 Navigator.pushReplacementNamed（取代路由）
* pushReplacementNamed 會移除 loading screen
* 避免返回時回到 loading 畫面

## 傳遞資料到下一個頁面

* 使用 arguments（參數）傳遞資料
* arguments 為 Map（鍵值對結構）
* 傳遞內容包含：

  * location（地點）
  * flag（國旗）
  * time（時間）
* 不再傳遞 API URL

## 接收 route data（路由資料）

* 使用 ModalRoute.of(context) 取得 route 資料
* 透過 settings.arguments 取得傳入 Map
* 將 arguments 存入 data 變數
* data 初始為空 Map

## build 方法中的資料取得

* 在 build method（建構函式）中讀取 arguments
* 不需要 setState 更新資料
* 因為 build 初次執行即完成初始化
* 直接覆蓋 data 變數

---

# 32 - Formatting & Showing Dates

## 安裝日期格式化套件

* 使用 intl（Internationalization 套件）
* 用於日期與時間格式化（date formatting）
* 透過 pubspec.yaml 安裝依賴

## 日期格式化處理

* 使用 DateFormat（日期格式化工具）
* 使用 JM format（時間格式：1:20 PM）
* 將 DateTime 轉換為可讀格式
* 提升 UI 可讀性（readability）

## UI 顯示資料來源

* data 變數儲存 route 傳入資料
* location、time 由 data Map 提供
* UI 直接讀取 data['location'] 與 data['time']

## Home UI 排版調整

* 使用 SizedBox（間距元件）增加間隔
* 使用 Row（水平排列）顯示 location 與 flag
* 使用 Column（垂直排列）組合 UI
* mainAxisAlignment: center 置中排版

## 樣式設計（Text Styling）

* 調整 fontSize（字體大小）

  * location：28
  * time：66
* 調整 letterSpacing（字距）
* 提升視覺層級區分

## Padding 調整布局

* 使用 EdgeInsets 控制四邊距離
* 上方 padding 設為 120
* 使內容往下移動避免貼頂

## 最終資料流程

* Loading screen 取得 API 資料
* 成功後透過 route 傳遞 Map
* Home screen 接收並存入 data
* UI 直接渲染 data 中的內容
* 日期經 intl 格式化後顯示更易讀時間

---

# 33 - Loaders / Spinners

## 改善 Loading 畫面 UI

* 原本 loading 畫面只有左上角文字，視覺效果不好
* 改用 spinner（載入動畫）提升使用者體驗（UX）
* 目標是在畫面中央顯示載入狀態

## 使用 flutter_spinkit 套件

* 使用 flutter_spinkit（Flutter spinner 套件）
* 透過 pubspec.yaml 安裝 dependency
* 使用 get dependencies 下載套件
* import 後即可使用內建 spinner widget

## 建立 Spinner UI

* 移除原本 Text widget（loading）
* 移除 padding 改用 Center widget
* spinner 放在 Center 的 child
* 讓動畫置中顯示

## Spinner 種類與替換

* 使用 RotatingCircle（旋轉圓圈）
* 可調整 size 改變大小
* 可替換不同 spinner widget
* 常見包括 CubeGrid、FoldingCube、FadingCube
* 每個動畫對應不同 widget 類別名稱

## UI 測試方式

* 使用 hot restart 測試 loading 畫面
* 暫時關閉頁面跳轉以觀察動畫
* 用來確認 spinner 顯示效果

---

# 34 - Ternary Operators

## 新增日夜判斷屬性

* 在 WorldTime class 新增 isDayTime（boolean）
* true 代表白天，false 代表夜晚
* 用來控制 UI 背景與顏色

## 三元運算子概念

* 使用條件 ? true結果 : false結果
* 用來根據條件快速回傳不同值
* 用於判斷是否為白天時間

## 時間判斷邏輯

* 使用 now.hour 取得小時（0–23）
* 判斷 hour > 6 且 hour < 20 為白天
* 否則為夜晚
* 使用 AND（&&）同時滿足條件
* 回傳 true 或 false

## 傳遞資料到 Home Page

* 在 loading page 建立 WorldTime instance
* 將 isDayTime 傳入 home page
* 使用 instance.isDayTime 取得結果
* 用於 UI 顯示邏輯

## 背景圖片切換

* 使用 ternary operator 決定背景圖片
* true 使用 day.png
* false 使用 night.png
* 使用 AssetImage 載入圖片
* 使用 BoxDecoration + DecorationImage 設定背景
* 使用 BoxFit.cover 填滿畫面

## 背景顏色切換

* 使用 ternary operator 控制背景色
* 白天使用 Colors.blue
* 夜晚使用 Colors.indigo[700]
* 與背景圖片同步變化

## UI 細節調整

* icon 改為灰色提升可讀性
* 文字改為白色增加對比
* 使用 TextStyle 設定文字樣式
* 提升不同背景下的清晰度

## Assets 管理

* 建立 assets/images 資料夾
* 放入 day.png 與 night.png
* 在 pubspec.yaml 註冊 assets
* 可直接使用整個資料夾圖片

## UI 更新流程

* 顯示 loading spinner
* API 完成後取得時間資料
* 判斷 isDayTime
* 更新背景與顏色
* 使用 setState 觸發畫面更新

---
# 35 - ListView Builder

## 建立 Location 資料來源

* 使用 world time class 的多個 instance 組成 locations list
* 每個 instance 包含 location、flag、url 等資料
* 用來代表不同城市的時間資料來源
* 未來點擊後會用來更新時間

## 匯入 WorldTime 類別

* 在 choose_location 頁面匯入 world_time class
* 讓此頁面可以使用 WorldTime instance
* 解決紅色錯誤（未引用類別問題）

## 使用 ListView.builder

* 使用 ListView.builder（列表建構器）
* 用於動態產生列表 UI
* 透過 itemCount 決定列表數量（locations.length）
* 使用 itemBuilder 建立每個列表項目
* itemBuilder 提供 context 與 index 參數

## 建立列表 UI 模板

* 每個 item 回傳 Card widget
* Card 內使用 ListTile 作為主要 UI
* ListTile 用來顯示圖示與文字組合
* 每個 item 都是重複模板產生

## 顯示城市名稱

* 使用 Text widget 顯示 location
* 透過 index 存取 locations[index]
* 再取 .location 屬性顯示城市名稱
* 動態依 index 變化內容

## 顯示國旗圖示

* 使用 leading 屬性放圖片
* 使用 CircleAvatar（圓形頭像）
* backgroundImage 使用 AssetImage
* 路徑來自 locations[index].flag
* 使用字串插值（string interpolation）取得圖片

## 加入點擊事件

* 使用 onTap 偵測點擊事件
* 點擊後觸發 function
* 可取得當前 index 與對應資料
* 用於後續更新時間功能

## 列表間距調整

* 使用 Padding 包住 Card
* 使用 EdgeInsets.symmetric
* vertical 控制上下間距
* horizontal 控制左右間距
* 讓 UI 更有空間感

## 測試列表功能

* 使用 print 測試點擊事件
* 輸出 location 與 index
* 確認 ListView.builder 正常運作
* 驗證每個 item 都能被點擊

---

# 36 - Updating the Time

## 建立更新時間函式

* 建立 updateTime(index) function
* 傳入 index 決定選擇哪個城市
* 使用 async function 因為需要等待 API

## 取得選擇的城市資料

* 使用 locations[index] 取得 WorldTime instance
* 存入 local variable instance
* 不重新建立物件，只取現有資料

## 呼叫 API 取得時間

* 使用 instance.getTime()
* 使用 await 等待 API 完成
* 確保資料回傳後才繼續執行

## 返回上一頁（Navigator.pop）

* 使用 Navigator.pop() 回到 home page
* 不使用 pushReplacement
* pop 會關閉目前頁面並返回上一頁
* 同時傳回資料給上一頁

## 傳回資料（return data）

* 使用 map 傳回多個值
* 包含 time、location、flag、isDayTime
* 讓 home page 更新所有資訊

## async navigation 流程

* 將頁面跳轉視為 async task
* 使用 await 等待 pop 回傳結果
* result 接收返回的 map 資料
* result 包含更新後的時間資訊

## 更新 Home Page 狀態

* 使用 setState 更新 data
* 將 result 資料寫入 state
* 更新 time、location、flag、isDayTime
* 觸發 UI rebuild

## 防止資料覆蓋問題

* 使用 isNotEmpty 檢查 data
* 避免重新載入初始 arguments 覆蓋更新資料
* 使用 ternary operator 判斷是否使用新資料
* 保留最新更新狀態

## 完整資料流流程

* 使用者點擊城市
* 呼叫 updateTime
* 取得 WorldTime instance
* 呼叫 API 更新時間
* pop 返回 home page
* 傳回更新資料
* setState 更新 UI
* 畫面顯示新城市時間


---

# Terminology
* Flutter（Flutter）：Google 開發的跨平台 UI 框架，用於建立 iOS 與 Android 應用程式
* UI 框架（UI Framework）：用於快速構建使用者介面的開發工具集合
* 原生應用（Native App）：直接在 iOS 或 Android 系統上執行的應用程式
* iOS（iOS）：Apple 的行動作業系統
* Android（Android）：Google 的行動作業系統
* API（API）：應用程式介面，用於與系統或服務互動
* 單一程式碼庫（Single Codebase）：一套程式碼可同時支援多平台
* Dart（Dart）：Flutter 使用的程式語言
* 程式語言（Programming Language）：用來撰寫軟體的規則與語法系統
* Android Studio（Android Studio）：Google 提供的 Android 開發整合環境
* Git（Git）：分散式版本控制系統
* 版本控制系統（Version Control System）：用於追蹤程式碼變更的工具
* 儲存庫（Repository）：存放專案程式碼的資料庫
* 克隆（Clone Git）：從遠端複製程式碼到本機
* 命令提示字元（Command Prompt）：在 Windows 中執行指令的介面
* 目錄（Directory）：檔案系統中的資料夾結構
* C 槽（C Drive）：Windows 系統主要磁碟分割
* Flutter 主控台（Flutter Console）：執行 Flutter 指令的終端環境
* Flutter Doctor（Flutter Doctor）：檢查 Flutter 環境是否正確安裝的工具
* SDK（SDK）：軟體開發工具包
* PATH 環境變數（PATH Environment Variable）：讓系統找到執行檔的路徑設定
* 變數（Variable）：用來儲存資料的記憶體位置
* 系統環境變數（System Environment Variables）：作業系統層級的設定參數
* Git 克隆（Git Clone）：從 Git 倉庫下載完整專案
* GitHub（GitHub）：程式碼託管平台
* 分支（Branch）：版本控制中不同開發線
* 除錯（Debugging）：找出並修正程式錯誤的過程
* Material Design（Material Design）：Google 設計的介面設計規範
* 響應式布局（Responsive Layout）：適應不同螢幕尺寸的介面設計
* 小工具（Widget）：Flutter 中構成 UI 的基本單位
* 小工具樹（Widget Tree）：UI 元件的階層結構
* 根小工具（Root Widget）：應用程式最外層的 Widget
* AppBar 小工具（AppBar Widget）：應用程式頂部標題列
* 文字小工具（Text Widget）：用於顯示文字內容
* 容器小工具（Container Widget）：用於包裝與排版其他元件
* 欄位小工具（Column Widget）：垂直排列子元件
* 列小工具（Row Widget）：水平排列子元件
* 圖片小工具（Image Widget）：顯示圖片的 UI 元件
* 按鈕小工具（Button Widget）：用於觸發互動的元件
* 屬性（Property）：用來設定 Widget 行為或外觀的參數
* 樣式屬性（Style Property）：控制文字或元件外觀的設定
* 文字對齊（Text Alignment）：控制文字排列方式
* 溢出（Overflow Property）：控制內容超出範圍時的行為
* 最大行數（Max Lines）：限制文字顯示行數
* 顏色屬性（Color Property）：設定元件顏色
* 陰影高度（Elevation Property）：控制元件的立體陰影效果
* 禁用顏色（Disabled Color）：按鈕不可用時的顏色
* 啟用狀態（Enabled Property）：控制元件是否可互動
* 類別（Class）：物件導向中定義物件的藍圖
* 物件導向程式設計（Object-Oriented Programming）：以物件與類別為核心的程式設計方法
* DartPad（DartPad）：線上 Dart 程式碼執行與測試環境
* 主函式（Main Function）：Dart 程式進入點，執行時自動呼叫
* 控制台輸出（Console Output）：程式執行時顯示結果的視窗
* 列印函式（Print Function）：輸出內容到控制台的函式
* 變數（Variable）：用於儲存資料的記憶體空間
* 靜態型別語言（Statically Typed Language）：變數型別在編譯時固定不可改變
* 型別（Type）：資料的分類，如 int、String、bool
* 整數（Integer）：不含小數點的數值型別
* 字串（String）：用於表示文字的資料型別
* 布林值（Boolean）：只有 true 或 false 的邏輯型別
* 動態型別（Dynamic Type）：允許變數在執行時改變型別
* 型別錯誤（Type Error）：資料型別不匹配導致的程式錯誤
* 函式（Function）：可重複執行的程式碼區塊
* 回傳值（Return Value）：函式執行後輸出的結果
* Void（Void）：表示函式不回傳任何值
* 主函式（Main Entry Function）：程式執行時第一個被呼叫的函式
* 參數（Parameter）：函式定義時接收的輸入值
* 引數（Argument）：函式呼叫時傳入的實際值
* 箭頭函式（Arrow Function）：用 => 簡化單行回傳函式寫法
* 單行函式（Single-line Function）：只包含一行運算或回傳的函式
* 陣列（Array）：JavaScript 中的資料結構，類似 Dart List
* 清單（List）：Dart 中用來儲存多個元素的集合
* 方法（Method）：隸屬於物件或類別的函式
* add 方法（Add Method）：向 List 新增元素的方法
* remove 方法（Remove Method）：從 List 移除元素的方法
* 泛型（Generics）：限制集合內資料型別的機制
* 型別約束（Type Constraint）：限制變數可接受的資料類型
* 尖括號（Angle Brackets）：用於泛型宣告 `<Type>`
* 類別（Class）：建立物件的藍圖
* 物件（Object）：類別的實例
* 實例化（Instantiation）：從類別建立物件的過程
* 建構子（Constructor）：建立物件時自動執行的初始化函式
* 屬性（Property）：類別內儲存資料的變數
* 方法（Method）：類別內定義的函式
* this 關鍵字（This Keyword）：代表目前物件實例
* 繼承（Inheritance）：子類別取得父類別功能的機制
* extends（Extends）：Dart 中實現繼承的關鍵字
* super（Super）：呼叫父類別建構子或方法
* 子類別（Subclass）：繼承其他類別的類別
* 父類別（Superclass）：被繼承的類別
* 多型（Polymorphism）：不同類別以相同介面表現不同行為
* 封裝（Encapsulation）：將資料與方法包在類別內
* 存取修飾（Access Control）：控制資料可見性的機制
* 預設值（Default Value）：未指定時自動使用的值
* 函式呼叫（Function Call）：執行函式的動作
* 錯誤訊息（Error Message）：程式執行失敗時的提示
* 語法（Syntax）：程式語言的規則結構
* 程式碼區塊（Code Block）：由大括號包住的一段程式碼
* 註解（Comment）：不會被執行的程式說明文字
* Dart SDK（Dart SDK）：Dart 開發工具包
* API（API）：應用程式之間互動的介面
* 文檔（Documentation）：官方提供的語言或框架說明資料
* Android Studio（Android Studio）：官方 Android 與 Flutter 開發整合開發環境（IDE）
* Flutter SDK（Flutter SDK）：Flutter 開發工具包，包含框架與工具鏈
* Android 模擬器（Android Emulator）：在電腦上模擬 Android 裝置的虛擬環境
* AVD Manager（AVD Manager）：Android Virtual Device 管理工具，用於建立模擬器
* 虛擬裝置（Virtual Device）：模擬實體手機或平板的軟體環境
* Nexus 6（Nexus 6）：Google 舊款 Android 手機型號，常用於模擬器測試
* 系統映像（System Image）：Android 模擬器使用的作業系統版本
* Android Pie（Android Pie）：Android 9 作業系統版本代號
* GPU 加速（Hardware Graphics Acceleration）：使用硬體提升圖形渲染效能
* Flutter 插件（Flutter Plugin）：Android Studio 的 Flutter 支援擴充套件
* Dart 插件（Dart Plugin）：提供 Dart 語言支援的 IDE 插件
* IDE 重啟（IDE Restart）：重新啟動開發環境以套用插件
* Flutter 專案（Flutter Project）：使用 Flutter 建立的應用程式專案
* 專案名稱（Project Name）：Flutter 專案的識別名稱
* 專案路徑（Project Location）：專案在電腦中的存放位置
* 公司網域（Company Domain）：用於生成 package 名稱的識別字串
* Android 資料夾（Android Folder）：存放 Android 平台相關設定與資源
* iOS 資料夾（iOS Folder）：存放 iOS 平台相關設定與資源
* lib 資料夾（Lib Folder）：主要 Dart 程式碼存放位置
* main.dart（Main Dart File）：Flutter 應用程式入口檔案
* 測試資料夾（Test Folder）：用於單元測試與自動化測試
* pubspec.yaml（Pubspec YAML）：Flutter 專案設定與依賴管理檔案
* 依賴套件（Dependencies）：專案所需的外部函式庫
* 資源檔（Assets）：圖片、字型等靜態資源
* 缩排規則（Indentation Rule）：YAML 檔案中結構層級依賴空白縮排
* MaterialApp（MaterialApp）：Flutter Material Design 應用程式根 Widget
* Scaffold（Scaffold）：提供基本 UI 架構的版型 Widget
* AppBar（AppBar）：應用程式頂部標題列 Widget
* Home 屬性（Home Property）：定義主畫面 Widget
* Body 屬性（Body Property）：主要內容區域
* FloatingActionButton（FloatingActionButton）：浮動圓形操作按鈕
* Child 屬性（Child Property）：單一子 Widget 容器
* Hot Reload（Hot Reload）：快速更新 UI 而不重啟整個應用
* Hot Restart（Hot Restart）：完全重新啟動應用並重建狀態
* StatelessWidget（StatelessWidget）：不可變狀態的 Flutter Widget
* StatefulWidget（StatefulWidget）：可變狀態的 Flutter Widget
* 狀態（State）：Widget 中會隨時間變化的資料
* Build 方法（Build Method）：用於建構 UI 的核心方法
* Widget 樹（Widget Tree）：Widget 的階層結構
* Override（Override）：覆寫父類別方法的關鍵字
* Inheritance（Inheritance）：繼承父類別功能的機制
* extends（extends）：Dart 中繼承關鍵字
* BuildContext（BuildContext）：Widget 在樹中的位置資訊
* UI 更新（UI Update）：畫面根據資料變化重新渲染
* Debug 模式（Debug Mode）：開發階段的除錯執行模式
* Layout（Layout）：UI 元件排列方式
* Widget 重用（Widget Reusability）：重複使用自訂 Widget 的能力
* 自訂 Widget（Custom Widget）：開發者自行建立的 Widget
* Material Design（Material Design）：Google UI 設計系統
* theme（Theme）：應用程式整體視覺風格設定
* Font Family（Font Family）：字型系列設定
* TextStyle（TextStyle）：文字樣式設定 Widget
* Colors（Colors）：Flutter 內建顏色工具類
* Shade（Shade）：顏色深淺等級
* UI Font Size（UI Font Size）：介面文字大小設定
* Center Widget（Center Widget）：將子元件置中
* Column Widget（Column Widget）：垂直排列 Widget
* Run Button（Run Button）：執行 Flutter 專案的按鈕
* 圖片元件（Image Widget）：用於在畫面中顯示圖片的基礎元件
* 網路圖片（NetworkImage）：透過 URL 從網路載入圖片的圖片來源類型
* 資產圖片（AssetImage）：從本地專案 assets 資料夾載入圖片的來源類型
* Image.asset 快捷方式（Image.asset）：直接載入本地資產圖片的簡化寫法
* Image.network 快捷方式（Image.network）：直接載入網路圖片的簡化寫法
* 專案配置檔（pubspec.yaml）：Flutter 專案中管理依賴與資源的設定檔
* 資產宣告（assets declaration）：在 pubspec.yaml 中註冊可用資源的設定
* 資產資料夾（asset folder）：存放圖片等靜態資源的專案目錄
* Flutter 視圖結構（Flutter Outline）：IDE 中顯示 Widget 樹狀結構的工具
* 操作選單（Action Menu）：提供 Widget 快速操作的 UI 功能選單
* 包裝元件（Wrap Widget）：將子元件包起來以進行排版控制的元件
* 替換子元件（Replace widget with children）：將父元件替換為其子元件的快捷操作
* 水平佈局（Row widget）：將子元件水平排列的佈局元件
* 垂直佈局（Column widget）：將子元件垂直排列的佈局元件
* 主軸對齊（MainAxisAlignment）：控制主方向上元件排列方式的屬性
* 交叉軸對齊（CrossAxisAlignment）：控制垂直於主軸方向排列方式的屬性
* 置中對齊（Center alignment）：將元件置於中央位置的對齊方式
* 平均分配（SpaceBetween alignment）：讓元件間平均分配空間但兩端貼齊
* 均勻分布（SpaceEvenly alignment）：讓所有間距與邊界均勻分布
* 邊距分布（SpaceAround alignment）：讓元件周圍保留均勻空間
* 起始對齊（Start alignment）：將元件靠齊起始方向（左或上）
* 結束對齊（End alignment）：將元件靠齊結束方向（右或下）
* 容器元件（Container widget）：可包裹子元件並提供樣式與佈局能力的元件
* 間距元件（Padding widget）：專門用來控制內距的佈局元件
* 邊距設定（EdgeInsets）：用來定義 padding 或 margin 的距離設定類別
* 全方向間距（EdgeInsets.all）：四個方向套用相同間距的設定方式
* 對稱間距（EdgeInsets.symmetric）：水平與垂直分別設定間距的方式
* 四向間距（EdgeInsets.fromLTRB）：分別設定左上右下間距的方法
* 子元件屬性（child property）：用來放置單一子元件的屬性
* 子元件列表（children property）：用來放置多個子元件的列表屬性
* Widget 樹（widget tree）：Flutter UI 由巢狀 Widget 組成的結構
* 佈局腳手架（Scaffold widget）：提供基本 UI 架構的主要頁面容器
* 主體區域（body property）：Scaffold 中顯示主要內容的區域
* 文字元件（Text widget）：用來顯示文字內容的基本 UI 元件
* 圖示元件（Icon widget）：用來顯示 Material Icons 圖示的元件
* 圖示庫（Icons library）：Flutter 內建的 Material Design 圖示集合
* Material 圖示（Material Icons）：Google Material Design 提供的標準圖示系統
* 圖示按鈕（IconButton）：可點擊的圖示型按鈕元件
* 按下按鈕（RaisedButton）：具有陰影效果的舊式按鈕元件（已過時）
* 扁平按鈕（FlatButton）：無陰影的舊式按鈕元件（已過時）
* 強調按鈕（ElevatedButton）：新版具有陰影的標準按鈕元件
* 點擊回呼（onPressed callback）：按鈕被點擊時觸發的函式
* 匿名函式（anonymous function）：沒有名稱的即時執行函式
* 列印函式（print function）：輸出訊息到控制台的除錯方法
* 除錯控制台（debug console）：顯示應用程式輸出與錯誤訊息的面板
* 顏色類別（Colors class）：Flutter 中提供預設顏色的工具類別
* 顏色屬性（color property）：用於設定元件顏色的屬性
* 對齊屬性（alignment property）：控制元件在容器內位置的設定
* 套件下載（Flutter pub get）：下載並更新專案依賴的指令
* 熱重載（hot reload）：快速刷新 UI 而不重啟應用程式的功能
* 展開元件（Expanded Widget）：在 Row 或 Column 中將子元件擴展並填滿可用空間的佈局工具
* 彈性佈局（Flex Layout）：透過比例分配空間的排版系統概念
* Flex 權重（Flex Factor）：決定 Expanded 元件在主軸中佔用比例的數值
* 主軸（Main Axis）：Row 為水平方向、Column 為垂直方向的主要排列方向
* 交叉軸（Cross Axis）：與主軸垂直的排列方向，用於對齊控制
* 空間分配（Space Distribution）：將可用空間依比例分配給多個元件
* 比例分割（Proportional Split）：依 flex 數值將畫面切割成不同份數
* 自適應寬度（Responsive Width）：元件依父容器空間自動調整大小
* 圖片溢出（Image Overflow）：圖片尺寸超出父容器導致版面破壞的現象
* 內容約束（Layout Constraint）：限制子元件最大/最小顯示範圍的規則
* 圖片封裝（Image Wrapping）：將圖片包在 Expanded 或其他元件內控制尺寸
* CircleAvatar 元件（CircleAvatar Widget）：用於顯示圓形圖片頭像的 UI 元件
* 背景圖片（Background Image）：設定在容器或頭像元件中的底圖
* Asset 圖片載入（Asset Image Loading）：從本地 assets 載入圖片的機制
* 半徑屬性（Radius Property）：控制圓形元件大小的數值設定
* 中心對齊（Center Widget）：將子元件置中顯示的對齊方式
* 分隔線元件（Divider Widget）：用於區隔 UI 區塊的水平線元件
* 高度空間（Height Spacer）：用 height 屬性控制垂直空白區域
* Row 子元件（Row Children）：Row 中可水平排列的多個 Widget 集合
* Column 子元件（Column Children）：Column 中垂直排列的 Widget 清單
* 空間填充（Space Filling）：Expanded 將剩餘空間填滿的行為
* 佈局彈性（Layout Flexibility）：元件根據比例調整大小的能力
* UI 比例控制（UI Proportion Control）：透過 flex 控制介面分配比例
* 橫向排版（Horizontal Layout）：Row 形成的左右排列結構
* 直向排版（Vertical Layout）：Column 形成的上下排列結構
* 小工具封裝（Widget Composition）：透過嵌套 Widget 建立 UI 結構
* 版面擴展（Layout Expansion）：元件占用更多可用空間的設計方式
* 固定空間（Fixed Space）：使用 SizedBox 建立固定間距的方法
* SizedBox 元件（SizedBox Widget）：用於產生固定寬高空白的 UI 元件
* 垂直間距（Vertical Spacing）：使用 height 控制上下間隔
* 水平間距（Horizontal Spacing）：使用 width 控制左右間隔
* 圖示元件（Icon Widget）：用於顯示 Material Icons 的圖形元件
* Email 圖示（Email Icon）：代表信件的 Material Icons 圖標
* 圖示顏色（Icon Color）：設定 icon 外觀顏色的屬性
* 文字樣式（Text Style）：控制文字外觀的設定集合
* 字距（Letter Spacing）：調整字元之間距離的排版屬性
* 字體大小（Font Size）：控制文字顯示大小的數值設定
* 字重（Font Weight）：設定文字粗細（如 bold）的屬性
* 灰階色階（Grey Shade）：Material Design 提供的灰色深淺變化
* 強度值（Shade Level）：顏色深淺等級（如 400、800）的設定
* AppBar 元件（AppBar Widget）：應用程式頂部標題列 UI 元件
* Scaffold 架構（Scaffold Layout）：Flutter 頁面基本結構框架
* 背景顏色（Background Color）：設定整體畫面或容器底色
* 標題置中（Center Title）：將 AppBar 標題置中顯示的設定
* Elevation 陰影（Elevation Shadow）：控制 UI 元件陰影深度的屬性
* Stateless Widget（Stateless Widget）：不包含狀態變化的靜態 UI 元件
* Widget 樹（Widget Tree）：Flutter UI 由巢狀結構組成的架構
* 依賴管理（Dependency Management）：透過 pubspec.yaml 管理套件與資源
* Hot Reload（熱重載）：快速更新 UI 而不重新啟動 App 的功能
* 無狀態元件（Stateless Widget）：不會隨時間或使用者互動而改變狀態的 Flutter 元件
* 有狀態元件（Stateful Widget）：可隨時間或事件改變內部狀態並更新 UI 的元件
* 狀態（State）：用來儲存會變動的資料，例如計數器或顏色
* 建立狀態（createState）：StatefulWidget 用來建立對應 State 物件的方法
* State 物件（State Object）：管理 StatefulWidget 狀態與 UI 重建的核心類別
* build 方法（build Method）：負責根據當前狀態回傳 UI 的方法
* widget 樹（Widget Tree）：由多個 widget 組成的階層結構 UI
* 重建（Rebuild）：當狀態改變時重新執行 build 更新 UI
* setState：通知 Flutter 狀態已改變並觸發 UI 重建的方法
* 生命週期（Lifecycle）：Widget 從建立到銷毀的完整過程
* 狀態管理（State Management）：管理應用程式資料與 UI 更新的方式
* 變數（Variable）：用來儲存資料的容器
* 整數（Integer）：沒有小數點的數值類型
* 字串（String）：用於儲存文字資料的資料型別
* 列表（List）：有序的資料集合
* 映射（Map）：將每個元素轉換為另一種形式的函式
* 迭代器（Iterable）：可逐一遍歷的資料集合
* 函式（Function）：可重複執行的一段程式碼
* 箭頭函式（Arrow Function）：簡寫形式的單行函式
* 建構子（Constructor）：建立物件時初始化資料的方法
* 類別（Class）：用來定義物件結構的藍圖
* 物件（Object）：類別的實例
* 封裝（Encapsulation）：將資料與方法包在同一類別中
* 抽象化（Abstraction）：隱藏細節只暴露必要功能
* 模組化（Modularization）：將程式拆分為獨立功能單元
* 單一職責原則（Single Responsibility Principle）：每個類別只負責一項功能
* 參數（Parameter）：函式接收的輸入值
* 命名參數（Named Parameter）：以名稱指定的函式參數
* 回傳值（Return Value）：函式執行後輸出的結果
* UI（User Interface）：使用者與應用互動的畫面
* Scaffold：Flutter 提供的基本頁面結構框架
* AppBar：應用程式頂部標題列元件
* FloatingActionButton：浮動操作按鈕
* Icon：圖示元件
* Colors：Flutter 的顏色系統
* Material Design：Google 的設計規範
* Column：垂直排列子元件的佈局
* Row：水平排列子元件的佈局
* Children：子元件列表
* CrossAxisAlignment：控制交叉軸對齊方式
* MainAxisAlignment：控制主軸對齊方式
* Text：顯示文字的元件
* TextStyle：設定文字樣式的類別
* Font Size：文字大小設定
* Color Shade：顏色深淺層級
* SizedBox：用來增加間距的元件
* Padding：內距，用來控制元件內部空間
* Margin：外距，用來控制元件外部空間
* Card：具有陰影與圓角的卡片元件
* Hot Reload：快速重新載入程式變更
* Hot Restart：完整重啟應用並重置狀態
* Widget 重用（Widget Reusability）：重複使用 UI 元件以提升效率
* 小工具生命週期（Widget Lifecycle）：Widget 從建立、更新到銷毀的完整流程
* 初始化狀態（initState）：State 物件建立後首次執行的生命週期方法
* 銷毀方法（dispose）：Widget 移除時用於釋放資源的生命週期方法
* 更新建構（build Rebuild）：狀態改變時重新執行 build 方法更新 UI
* super.initState（Super Init State）：呼叫父類別 initState 的標準流程
* 覆寫（Override）：重新定義父類別方法的行為
* 狀態變更（State Change）：資料更新導致 UI 重新渲染
* 訂閱（Subscription）：監聽資料來源變化（如 Stream）
* 串流（Stream）：持續輸出非同步資料的資料流
* 非同步資料（Asynchronous Data）：不立即回傳的資料操作結果
* 事件驅動（Event-driven）：由使用者操作或系統事件觸發更新
* 生命週期鉤子（Lifecycle Hook）：可插入自訂邏輯的生命週期方法
* 除錯輸出（Debug Print）：用 print 顯示執行狀態
* 狀態初始化（State Initialization）：設定初始變數值
* 物件銷毀（Object Disposal）：釋放記憶體與資源的過程
* 記憶體管理（Memory Management）：控制資源使用與釋放
* 重建觸發（Rebuild Trigger）：導致 UI 重新建構的事件
* UI 更新（UI Update）：畫面根據資料變化重新渲染
* 狀態物件（State Object）：管理 StatefulWidget 狀態的類別
* Widget 建立（Widget Creation）：首次生成 UI 元件
* Widget 移除（Widget Removal）：從 widget tree 中刪除元件
* Flutter 框架（Flutter Framework）：Google 的跨平台 UI 開發框架
* Dart 語言（Dart Language）：Flutter 使用的程式語言
* 狀態變數（State Variable）：儲存在 State 內的可變資料
* 計數器（Counter）：用來累加數值的變數
* 增量運算（Increment Operation）：數值加一的操作
* setState 方法（setState Method）：觸發 UI 重建的核心方法
* 回呼函式（Callback Function）：作為參數傳入的函式
* 函式執行（Function Execution）：函式被呼叫並運行
* UI 重繪（UI Redraw）：畫面重新繪製的過程
* 狀態同步（State Sync）：資料與 UI 保持一致
* 除錯模式（Debug Mode）：開發時用來檢查程式狀態
* Widget 樹更新（Widget Tree Update）：UI 階層結構重新生成
* 生命週期管理（Lifecycle Management）：控制 Widget 各階段行為
* 資源釋放（Resource Release）：釋放不再使用的記憶體或物件
* 初始化呼叫（Initialization Call）：物件建立時觸發的方法
* UI 觸發更新（UI Trigger Update）：由事件導致的畫面更新
* 狀態持久化（State Persistence）：保持資料在生命週期中的穩定性
* UI 狀態同步（UI State Sync）：畫面與資料狀態同步更新
* 函式重寫（Method Override）：改寫繼承方法行為
* 父類別（Superclass）：被繼承的基礎類別
* 子類別（Subclass）：繼承父類別的類別
* 物件導向（Object-Oriented Programming）：以物件為核心的程式設計方式
* 除錯訊息（Debug Message）：輸出執行過程資訊
* 狀態驅動 UI（State-driven UI）：UI 由狀態變化控制
* 建構流程（Build Process）：生成 UI 的過程
* 方法呼叫（Method Invocation）：執行函式或方法
* Flutter 元件更新（Flutter Component Update）：UI 元件隨狀態改變更新
* 非同步事件（Async Event）：延遲觸發的事件處理
* 資料驅動（Data-driven）：由資料變化控制應用行為
* 非同步程式設計（Asynchronous Programming）：允許程式在等待任務完成時繼續執行其他操作的程式設計模式
* Future物件（Future）：代表未來會完成並回傳結果的非同步資料容器
* async關鍵字（async keyword）：標記函式為非同步函式，使其可使用await
* await關鍵字（await keyword）：暫停執行直到Future完成並取得結果
* 非阻塞（Non-blocking）：程式不會因等待某任務而停止執行後續程式碼
* 回呼函式（Callback Function）：在特定事件完成後被自動呼叫的函式
* 延遲執行（Future.delayed）：用於模擬或設定延遲後執行的非同步操作
* 時間持續（Duration）：表示一段時間長度的物件（如秒、分鐘）
* 初始化狀態（initState）：StatefulWidget建立時最先執行的方法
* 有狀態元件（StatefulWidget）：可隨時間改變UI狀態的Flutter元件
* 狀態更新（setState）：通知Flutter重新構建UI的方法
* HTTP套件（HTTP Package）：用於發送網路請求的Dart套件
* 套件網站（pub.dev）：Flutter與Dart套件的官方發布平台
* 依賴套件（Dependencies）：專案中引用的外部函式庫
* pubspec檔案（pubspec.yaml）：Flutter專案管理套件與設定的檔案
* 套件管理器（Package Manager）：負責安裝與管理外部函式庫的工具
* 匯入語句（Import Statement）：將外部函式庫引入當前檔案
* API端點（API Endpoint）：提供資料存取的特定URL路徑
* REST API（REST API）：基於HTTP協定的網路服務架構
* JSON格式（JSON）：輕量級資料交換格式
* JSON解析（JSON Decode）：將JSON字串轉換為可用資料結構
* dart:convert函式庫（dart:convert）：提供JSON轉換等資料處理功能
* 回應物件（Response Object）：HTTP請求後返回的結果封裝
* 回應內容（Response Body）：HTTP回應中實際的資料內容
* 字串（String）：用於儲存文字的資料型別
* 字串插值（String Interpolation）：在字串中嵌入變數的技術
* 類別（Class）：定義物件結構與行為的藍圖
* 建構子（Constructor）：用於初始化類別物件的特殊函式
* 命名參數（Named Parameters）：透過名稱指定函式參數的方式
* 物件實例（Instance）：由類別建立的具體物件
* 方法（Method）：隸屬於類別的函式
* 函式（Function）：可重複執行的程式碼區塊
* 變數（Variable）：用於儲存資料的記憶體空間
* 空安全（Null Safety）：避免變數為空值導致錯誤的機制
* 熱重啟（Hot Restart）：重新啟動應用並清除狀態
* 除錯主控台（Debug Console）：顯示程式輸出與錯誤資訊的工具
* 元件生命週期（Widget Lifecycle）：Flutter元件從建立到銷毀的過程
* 載入狀態（Loading State）：資料尚未完成時的UI狀態
* UI重建（UI Rebuild）：因狀態改變而重新繪製畫面
* 狀態管理（State Management）：管理應用程式資料與UI同步的方式
* 非同步回傳型別（Future<void>）：表示非同步函式不回傳具體值
* 錯誤處理（Error Handling）：處理程式執行錯誤的機制
* 子字串（Substring）：從字串中擷取部分內容的方法
* 整數解析（int.parse）：將字串轉換為整數的方法
* 日期時間類別（DateTime）：處理日期與時間的核心類別
* 時區偏移（Timezone Offset）：不同地區與UTC時間的差異
* 世界時間API（World Time API）：提供全球各地時間資料的服務
* 錯誤處理（Error Handling）：在程式執行發生異常時進行捕捉與處理以避免崩潰
* Try-Catch區塊（Try-Catch Block）：用來嘗試執行程式並捕捉錯誤的結構
* Try關鍵字（try keyword）：標記可能發生錯誤的程式碼區塊
* Catch區塊（catch block）：捕捉並處理try中發生的錯誤
* 例外物件（Exception Object）：描述程式錯誤原因的物件
* 除錯訊息（Debug Message）：輸出錯誤或狀態資訊以協助開發
* 空值錯誤（Null Error）：變數為null卻被使用導致的錯誤
* API請求失敗（API Request Failure）：向伺服器請求資料未成功的情況
* 無效端點（Invalid Endpoint）：錯誤或不存在的API URL
* JSON解析錯誤（JSON Parsing Error）：JSON格式無法正確轉換時的錯誤
* 型別不匹配（Type Mismatch）：資料型別不符合預期導致的錯誤
* Map型別（Map Type）：以鍵值對儲存資料的結構
* 動態型別（Dynamic Type）：可接受任何型別的變數
* Future錯誤（Future Error）：非同步操作失敗導致的錯誤
* 非同步例外（Asynchronous Exception）：在非同步流程中發生的錯誤
* UI崩潰（UI Crash）：因錯誤導致介面無法正常顯示
* 防呆機制（Fail-Safe Mechanism）：避免錯誤影響整體系統的設計
* 預設值（Default Value）：當錯誤發生時使用的備用值
* 錯誤回傳（Error Return）：函式發生錯誤時回傳替代結果
* 條件判斷（Conditional Statement）：根據條件決定程式流程
* 三元運算子（Ternary Operator）：簡化if-else的條件運算語法
* 布林值（Boolean）：只有true或false的資料型別
* 狀態更新（State Update）：透過setState更新UI資料
* 狀態重建（Widget Rebuild）：UI因狀態改變重新渲染
* 路由導航（Navigation Routing）：頁面之間的切換機制
* pushReplacement（推送替換）：用新頁面取代當前頁面的導航方式
* pop返回（Navigator.pop）：將當前頁面移除並返回上一頁
* 路由堆疊（Route Stack）：管理頁面導航順序的結構
* arguments參數（Route Arguments）：頁面之間傳遞資料的方式
* Map資料傳遞（Map Data Passing）：以鍵值對形式傳遞資料
* ModalRoute（模態路由）：取得當前路由資訊的工具
* settings.arguments（Route Settings Arguments）：從路由設定取得傳入資料
* 非同步流程（Async Flow）：包含等待與後續執行的流程
* await等待機制（Await Mechanism）：暫停執行直到Future完成
* async函式（Async Function）：可執行非同步操作的函式
* 資料回傳（Data Return）：函式返回結果給呼叫者
* 資料驗證（Data Validation）：檢查資料是否有效
* API錯誤訊息（API Error Message）：伺服器回傳的錯誤內容
* try失敗路徑（Failure Path）：try區塊執行失敗後的流程
* catch處理邏輯（Catch Logic）：錯誤發生後的替代處理方式
* 使用者提示（User Feedback）：向使用者顯示錯誤或狀態資訊
* 載入狀態維持（Loading State Persistence）：等待資料時維持載入畫面
* fallback UI（備援介面）：發生錯誤時顯示的替代畫面
* 安全更新（Safe Update）：避免錯誤導致UI崩潰的更新方式
* 非破壞性更新（Non-destructive Update）：不影響既有資料的更新
* 資料覆寫（Data Override）：用新資料取代舊資料
* 資料同步（Data Synchronization）：確保UI與資料一致
* 狀態一致性（State Consistency）：避免UI與資料不一致的狀態
* 錯誤日誌（Error Logging）：記錄錯誤資訊以供分析
* console輸出（Console Output）：在開發工具中顯示訊息
* hot restart（熱重啟）：重新啟動應用並重建狀態
* runtime error（執行時錯誤）：程式執行過程中發生的錯誤
