// Feel Friends — content library (the SEL curriculum, as data).
// Mirrors docs/08-content-library.md.

export const EMOTIONS = [
  { key:'happy',      emoji:'😊', color:'#FFD56B', def:"Happy is a sunny feeling inside. You might smile or want to giggle.", helps:"Share it! Tell someone what made you happy." },
  { key:'sad',        emoji:'😢', color:'#7CA9E0', def:"Sad is a heavy, droopy feeling. Sometimes your eyes get teary.", helps:"It's okay to cry. A hug or a grown-up can help." },
  { key:'angry',      emoji:'😠', color:'#FF6B5E', def:"Angry is a hot, big feeling. Your body might feel tight.", helps:"Take a slow breath. Use your words, not your hands." },
  { key:'frustrated', emoji:'😣', color:'#FF9F5A', def:"Frustrated is when something is hard and you want to give up.", helps:"Take a breath and ask, 'Can I have help?'" },
  { key:'nervous',    emoji:'😰', color:'#B7E07C', def:"Nervous is a wobbly, fluttery tummy feeling before something new.", helps:"Breathe slow. You can be brave even when you're nervous." },
  { key:'scared',     emoji:'😨', color:'#9B8CE0', def:"Scared is when something feels too big or surprising.", helps:"Find a grown-up. You are safe. Let's breathe together." },
  { key:'proud',      emoji:'😌', color:'#FFB36B', def:"Proud is a tall, warm feeling when you did something hard.", helps:"Say it out loud: 'I did it!'" },
  { key:'lonely',     emoji:'😞', color:'#8FB0C9', def:"Lonely is when you wish someone was with you.", helps:"You can ask, 'Can I play too?'" },
  { key:'excited',    emoji:'🤩', color:'#FF8FC7', def:"Excited is a bouncy, can't-wait feeling!", helps:"Wiggle it out, then take a breath to feel calm-excited." },
  { key:'confused',   emoji:'😕', color:'#C0B7A8', def:"Confused is when things don't make sense yet.", helps:"That's okay! Ask a question: 'Can you show me?'" },
];
export const emo = (k) => EMOTIONS.find(e => e.key === k);

// "Name That Feeling" — situation -> correct emotion
export const SITUATIONS = [
  { text:"You got to play your favorite game.", answer:'happy' },
  { text:"Your tower fell down right after you built it.", answer:'frustrated' },
  { text:"It's your very first day somewhere new.", answer:'nervous' },
  { text:"You tied your shoes all by yourself!", answer:'proud' },
  { text:"Nobody is playing with you right now.", answer:'lonely' },
  { text:"Someone knocked over your blocks on purpose.", answer:'angry' },
];

// Story Adventures — branching scenarios
export const STORIES = [
  {
    id:'sharing', title:'Sharing', emoji:'🧸', face:'😊',
    scene:"You're playing with a truck. Another friend really wants a turn.",
    choices:[
      { emoji:'🗣️', label:'"We can take turns. You can have it next."', good:true,
        outcome:"Your friend smiles and you both play happily. That felt good! ⭐", feel:'happy' },
      { emoji:'😠', label:'Hold it tight: "No! Mine!"', good:false,
        outcome:"Your friend looks sad and playing feels yucky. Want to try a kinder way?", feel:'sad' },
      { emoji:'😢', label:'Give it up and feel bad', good:false,
        outcome:"You feel a little lonely. You can share AND still get a turn. Try again?", feel:'lonely' },
    ]
  },
  {
    id:'pushed', title:'Being pushed', emoji:'🧍', face:'😠',
    scene:"You're standing in line and someone pushes you.",
    choices:[
      { emoji:'🗣️', label:'"Please stop. I don\'t like that."', good:true,
        outcome:"You used your brave voice! If it keeps happening, tell a grown-up. 💪", feel:'proud', bravePhrase:'please-stop' },
      { emoji:'😠', label:'Push them back', good:false,
        outcome:"Now you're both upset and a grown-up has to help. Pushing can hurt. Try your brave words?", feel:'angry' },
      { emoji:'🤐', label:'Say nothing and feel upset', good:false,
        outcome:"Your feelings matter. You're allowed to say 'Please stop.' Try it?", feel:'sad' },
    ]
  },
  {
    id:'excluded', title:'Being left out', emoji:'🙅', face:'😞',
    scene:"Two friends are playing and say, \"You can't play with us.\"",
    choices:[
      { emoji:'🗣️', label:'"Can I play too?"', good:true,
        outcome:"Sometimes they say yes! Sometimes you find another friend. Both are okay. 🌈", feel:'happy', bravePhrase:'can-i-play' },
      { emoji:'😢', label:'Walk away feeling lonely', good:false,
        outcome:"That's a sad, lonely feeling. You're allowed to ask to join in. Try again?", feel:'lonely' },
      { emoji:'😠', label:'Knock down their game', good:false,
        outcome:"That made everyone upset. Asking with words works better. Try it?", feel:'angry' },
    ]
  },
  {
    id:'help', title:'Asking for help', emoji:'🙋', face:'🤩',
    scene:"You can't open your snack and you're getting frustrated.",
    choices:[
      { emoji:'🗣️', label:'"Can I have help, please?"', good:true,
        outcome:"A grown-up helps and you feel relieved and proud. Asking is smart! ⭐", feel:'proud', bravePhrase:'can-i-help' },
      { emoji:'😣', label:'Keep struggling silently', good:false,
        outcome:"You feel more and more frustrated. Asking for help is brave! Try it?", feel:'frustrated' },
      { emoji:'😢', label:'Give up and feel sad', good:false,
        outcome:"It's okay to need help — everyone does! Want to ask?", feel:'sad' },
    ]
  },
];

// Brave Voice — phrases
export const PHRASES = [
  { id:'please-stop', text:'Please stop.',        when:"When someone does something you don't like to your body or things." },
  { id:'dont-like',   text:"I don't like that.",  when:"When something feels unkind or uncomfortable. Your feelings are okay to share." },
  { id:'can-i-help',  text:'Can I have help?',    when:"When something is too hard, or you feel unsafe. Asking is brave!" },
  { id:'can-i-play',  text:'Can I play too?',     when:"When you want to join in and you feel left out." },
];
export const phrase = (id) => PHRASES.find(p => p.id === id);

// Empathy Lab — "how does this friend feel?"
export const EMPATHY = [
  { emoji:'🍦😢', text:"This friend dropped their ice cream.", answer:'sad',   help:"What could we do to help? Maybe share or give a hug. 💜" },
  { emoji:'🎉🥳', text:"This friend won the game!",            answer:'excited', help:"You could cheer for them! 🎉" },
  { emoji:'🧩😣', text:"This friend can't finish the puzzle.", answer:'frustrated', help:"You could offer to help: 'Want a hand?'" },
  { emoji:'🐶❤️', text:"This friend got a new puppy.",        answer:'happy', help:"You could be happy with them!" },
];

// Good Choice Challenge
export const CHOICES = [
  { emoji:'🧹🧸', text:"It's clean-up time, but you want to keep playing.",
    good:{ label:'Help clean up', emoji:'🧹', outcome:"Clean-up is faster together — then more play time! ⭐" },
    bad:{ label:'Keep playing', emoji:'🙅', outcome:"The toys stayed everywhere. Want to choose again?" } },
  { emoji:'😟🤝', text:"Your friend looks sad and lonely.",
    good:{ label:'Go comfort them', emoji:'🤝', outcome:"Your kindness helped your friend feel better. 💜" },
    bad:{ label:'Ignore them', emoji:'🙈', outcome:"Your friend still feels sad. Want to try a kinder choice?" } },
  { emoji:'🥛😬', text:"Oops — you spilled your drink.",
    good:{ label:'Tell a grown-up', emoji:'🗣️', outcome:"Telling the truth is brave. Mistakes are okay! ⭐" },
    bad:{ label:'Hide it', emoji:'🙊', outcome:"Hiding it made it worse. It's safer to tell the truth. Try again?" } },
];

// Kindness Missions (offline, real-world)
export const MISSIONS = [
  "Give someone a big smile today 😊",
  "Help put some toys away 🧸",
  "Say something kind to a friend 💛",
  "Give a gentle hug (if they want one) 🤗",
];

export const AVATARS = ['🐻','🐰','🦊','🦉','🐱','🐸','🐥','🦄'];
export const AGE_BANDS = ['3-4','4-5','5-6'];
