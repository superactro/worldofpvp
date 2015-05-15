// CLIENT player.js 

ig.module('game.entities.player')
.requires(
    'plugins.client'
    )
.defines(function() 
{
    EntityPlayer = EntityClient.extend({

//================================================================================

type: ig.Entity.TYPE.A, 
checkAgainst: ig.Entity.TYPE.NONE,
collides: ig.Entity.COLLIDES.NEVER, // box2d collision
headAnims: {},
currentHeadAnim: 'idle',
hidden: false,
fs: 0.1, // frame speed
size: 
{
    x: 32,
    y: 32
},
offset: 
{
    x: 4,
    y: 4
},

animSheet: new ig.AnimationSheet('media/playerBottom.png', 32, 32),
animSheetTop: new ig.AnimationSheet('media/playerTop.png', 32, 32),

init: function(x, y, settings) 
{

    this.parent(x, y, settings);

    ig.input.bind(ig.KEY.W, 'jump');
    ig.input.bind(ig.KEY.A, 'left');
    ig.input.bind(ig.KEY.S, 'down');
    ig.input.bind(ig.KEY.D, 'right');

    this.addAnim('idle',    this.fs, [8]);
    this.addAnim('left',    this.fs, [8, 9, 10, 11, 12, 13]);
    this.addAnim('right',   this.fs, [8, 9, 10, 11, 12, 13]);
    this.addAnim('jump',    this.fs, [8, 9, 10, 11, 12, 13]);

    this.headAnims['idle']  = new ig.Animation(this.animSheetTop, this.fs, [8]);
    this.headAnims['left']  = new ig.Animation(this.animSheetTop, this.fs, [8]);
    this.headAnims['jump']  = new ig.Animation(this.animSheetTop, this.fs, [8]);
    this.headAnims['spawn'] = new ig.Animation(this.animSheetTop, this.fs, [8]);

    this.currentAnim = this.anims.idle;
    this.currentHeadAnim = this.headAnims.idle;

},

update: function() 
{

    this.parent();

    if (this.anim == 'jump') 
    {
        this.currentAnim = this.anims.jump;
        this.currentHeadAnim = this.headAnims.idle;
    }        
    else if (this.anim == 'right')  
    {
        this.currentAnim = this.anims.right;
        this.currentHeadAnim = this.headAnims.idle;
    }
    else if (this.anim == 'down')
    {
        this.currentAnim = this.anims.down;
        this.currentHeadAnim = this.headAnims.idle;
    }   
    else if (this.anim == 'left')
    {
        this.currentAnim = this.anims.left;  
        this.currentHeadAnim = this.headAnims.idle;
    }   
    else if (this.anim == 'idle')   
    {
        this.currentAnim = this.anims.idle; 
        this.currentHeadAnim = this.headAnims.idle;
    }



// Center screen
if (ig.client.getClientId() == this.owner) 
{
    ig.game.screen.x = this.pos.x - ig.system.width/2;
    ig.game.screen.y = this.pos.y - ig.system.height/2;
}
}
});
});
