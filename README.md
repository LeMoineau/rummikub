# rummikub
Jeu de table "Rummikub" en ligne grâce à socket.io

# Fonctionnement

Pour lancer une partie, il faut préalablement lancer un serveur.

## Lancer un serveur

- ouvrez un terminal/PowerShell à la racine du répertoire
- tapez la commande ``node server/server.js``

Normalement vous devriez voir dans votre terminal la ligne 
``listening on *:3000``

Vous pouvez maintenant vous rendre à l'adresse ``localhost:3000`` ou encore ```127.0.0.1:3000`` sur votre navigateur préféré pour voir s'afficher l'écran d'acceuil du jeu !

## Lancer une partie

Pour lancer une partie vous devez suivre les étapes suivantes:
- rentrer un pseudo
- créer un salle
- attendre qu'au moins 1 autre joueur rejoingne votre partie (le nombre minimum de joueur pour commencer la partie est de 2 mais peut être modifier par l'hote de la partie: vous !)
- se mettre prêt
Une fois tous les joueurs prêts, la partie se lancera automatiquement !

## Rejoindre une partie

Pour rejoindre une partie, vous devez:
- rentrer un pseudo
- demander le code à 4 caractère majuscule au créateur de salle
- entrer ces caractere dans la bulle "Code de la partie" (en vrai, cette section du tuto ne sert vraiment à pas grand chose ':!)
- puis enter ou "Rejoindre la partie"

# Remarques

Les regles du Rummikub en ligne sont les mêmes que celles du Rummikub sur table sauf si l'hôte de la partie décide de faire joujou avec les options de la partie ;)

Attention, par défaut le serveur tourne en local. Pour jouer avec des gens sur d'autres ordinateurs vous devrez soit jouer sur le même réseau soit lancer le serveur chez un herbergeur proposant des services node.js soit faire des bidouilles avec vos ouvertures de port de modem soit utiliser des "propageurs d'adresses IP" comme _hamachi_.

Ici, je ne détaillerai que la méthode pour jouer ensemble sur un même réseau (parce que flemme de vous apprendre des choses dont moi aussi je suis un peu flou ':D)

## Pour jouer ensemble sur un même réseau

Pour jouer ensemble sur un même réseau, rien de plus simple (je mens, manger des _Princes_ c'est bien plus facile et en plus meilleurs) ! Il suffit pour les joueurs non-hôte, de rentrer l'adresse de l'hote à la place de ``localhost`` ou ``127.0.0.1`` dans l'URL du navigateur.

__exemple__: si l'adresse de l'hote sur le réseau est ``192.168.0.21``, alors tous les autres que l'hote devront entrer dans leur navigateur ```192.168.0.21:3000`` comme URL pour se connecter au serveur puis copier le code la partie comme indiquer dans la section plus haut. (Vous pouvez obtenir votre adresse sur le réseau grâce à la commande ``ipconfig`` dans un terminal windows ligne ``Adresse IPv4``)
