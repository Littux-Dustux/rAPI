Incomplete library to access the Reddit API from a bookmarklet.

**Contributions welcome**

---

`src/richtext` is code taken from Devvit. It should allow you to build rtjson strings like this:

```js
const rtjson = new RichTextBuilder()
	.heading({ level: 2 }, (t) => {
		t.link({
			text: "Richtext JSON ",
			url: "https://www.google.com",
			tooltip: "Link to google",
		});
		t.rawText("test");
	})
	.image({
		mediaId: "aBcdeFgh",
		caption: "A cool image",
		blur: "spoiler",
	});

console.log(rtjson.build()); // {"document": [<entries>]}
```

Equivalent to markdown:

```md
## [Richtext JSON](https://www.google.com "Link to google") test

![img](aBcdeFgh "A cool image")
```

You can create comments and submissions using the resulting data by supplying it on the `richtext_json` field instead of `text`. Inline images and videos only work if you use rtjson.