TODO
====


## Url mapping
```
features/$app/index.html -> /
features/$app/style.less -> /style.css
features/$app/style-@ios.less -> /style.css (merged)
```

## Packaging
`> vroom build android ios web web:chromeapp`
```
dist\
    android\
    ios\
    web\
        5499a05a37e57947b87f176f2d5a21df.app.js     - app.js
        007ccaa83aa7674f1166352c3605b85c.module1.js
        f9cce95db5c816a935906a713c78aff5.module2.js
        9cfefed8fb9497baa5cd519d7d2bb5d7.locale.js  - locale
        82a9e4d26595c87ab6e442391d8c5bba.locale.js  - locale-@fr
        index.html
        robots.txt
        favion.ico
    web:chromeapp\
        adbf5a778175ee757c34d0eba4e932bc.app.js     - app-@chromeapp.js
        007ccaa83aa7674f1166352c3605b85c.module1.js
        f9cce95db5c816a935906a713c78aff5.module2.js
        9cfefed8fb9497baa5cd519d7d2bb5d7.locale.js  - locale
        82a9e4d26595c87ab6e442391d8c5bba.locale.js  - locale-@fr
        index.html
        icon-64.png
        icon-128.png

```

* * *
# TODO: #
- url mapping

- feature dependencies

- dynamic rules static packaging?
    1. generated in a permutation
    2. css rules
