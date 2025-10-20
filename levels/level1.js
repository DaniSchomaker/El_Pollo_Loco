const level1 = new Level ( 
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud("img/5_background/layers/4_clouds/1.png", 0),
        new Cloud("img/5_background/layers/4_clouds/2.png", 720),
        new Cloud("img/5_background/layers/4_clouds/1.png", 720*2),
        new Cloud("img/5_background/layers/4_clouds/2.png", 720*3)
    ],
    [
    new BackgroundObject("img/5_background/layers/air.png", -720), 
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720), 
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

    new BackgroundObject("img/5_background/layers/air.png", 0), 
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0), // "0" für die X-Achse, Y-Achse wird über die Klassen gesetzt
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 720), 
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720), 
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

    new BackgroundObject("img/5_background/layers/air.png", 720*2), 
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 720*2), // "0" für die X-Achse, Y-Achse wird über die Klassen gesetzt
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 720*2),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 720*2),
    new BackgroundObject("img/5_background/layers/air.png", 720*3), 
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720*3), 
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720*3),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720*3)
  ],
  [
    new Coin(),
    new Coin(),
    new Coin(),
    new Coin(), 
    new Coin()
  ],
  [
    new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 150),
    new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 325),
    new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 468),
    new Bottle("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 589),
    new Bottle("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 425)
  ]
)
