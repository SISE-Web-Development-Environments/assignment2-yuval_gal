<a name="logo"></a>
# Assignment2

![Pacman Logo](images/logopacman.png)
# Created by:
## Yuval Ben Eliezer (313581381) and Gal Rosenthal (312585268)

# Table Of Content
1. [ Logo. ](#logo)
1. [ Play The Game. ](#Playing_The_Game)
1. [ Game Instructions. ](#instructions)
    1. [ Sign Up. ](#sign-up)
    1. [ Login. ](#login)
1. [ Settings. ](#settings)
1. [ In Game Instructions. ](#gameplay)
1. [ The functionality we added to the game. ](#The_functionality_we_added_to_the_game)
<a name="Playing_The_Game"></a>
# Link To the Game
### For playing the game, Click the link below 
### [Start the Game](https://sise-web-development-environments.github.io/assignment2-yuval_gal/)
you can also try the link:
<br>
https://sise-web-development-environments.github.io/assignment2-yuval_gal/

<a name="instructions"></a>
# Game Instructions
<a name="signup"></a>
## Sign Up
<p>In order to play the game, you <b>must</b> SignUp using the Signup 
page and form.</p>
<p>
You can also use the default user,<br> Username: p <br> Password: p
</p>

<a name="login"></a>
## Login
<p>After you signed up you can now login through the Login Page.</p>
 
<a name="settings"></a>
# Settings
<p> There are a few Settings for the game that are customisable by the user:</p>

Those are `default` values. 


 * Key Up: `ArrowUp`
 * Key Down: `ArrowDown`
 * Key Left: `ArrowLeft`
 * Key Right: `ArrowRight`
 * Number of eatable balls: `50`
 * Max Time (in seconds): `60`
 * Number of Ghosts: `4`
 * Color for the small balls: `blue`
 * Color for the medium balls: `red`
 * Color for the high balls: `black`
 
also you can choose to randomize these parameters, <b>the keys will not be randomized</b>.
<br>
<b>Once you pressed `Let's Start the Game!` you will not be able to change those settings, 
if you wish to change them again, logout from the game and relogin.</b>
<br>

<a name="gameplay"></a>
# Gameplay
While playing the game, you use the Keys defined above in the Settings.
<br>
There are 3 ways to finish the game:
* The game will end if the time is up.
* The game will end if you are getting hit by the ghosts more then 5 times.
* The game will end if you get approx ~500 points.
<br>
<br>
<p>In the game there is a another character besides the pacman and the ghosts,
this is dave, if you eat dave you will earn 50 points.
<br>
</p>
<br>
<a name="The_functionality_we_added_to_the_game"></a>
#The_functionality_we_added_to_the_game
The functionality we added to the game:
<br>
1. There is a clock floating in a random place in the game, eating it will increase the `Max Time` by 10 seconds.
<br>
2. There are 3 pills floating at random place in the board, eating a pill will increase the remaining Lives by 1.
