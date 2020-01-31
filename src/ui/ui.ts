import './ui.css'
import './figma-plugin-ds.min.css'
import './figma-plugin-ds.min.js'
import './aklite.js'

const tabs = {
	// doms
	tabs: null,
	pages: null,
	curr: '',

	init: () => {
		tabs.tabs = document.querySelectorAll('.tabs-header .tab')
		tabs.pages = document.querySelectorAll('.tab-content')

		tabs.tabs.forEach(tab => tab.addEventListener('click', tabs.activateHandler))
	},

	activateHandler: (e: MouseEvent) => {
    let target = e.target as HTMLElement
    tabs.activate(target.innerText.toLowerCase())
  },

	activate: (id: string) => {
		tabs.tabs.forEach(tabs.hide)
		tabs.pages.forEach(tabs.hide)

		document.getElementById(id).classList.add('active')
		document.querySelector(`.tabs-header .tab[activates="${id}"]`).classList.add('active')

		tabs.curr = id

		parent.postMessage({ pluginMessage: { type: 'tab-change', id } }, '*')
	},

	// helper functions
	hide: (dom: HTMLElement) => dom.classList.remove('active')
}

document.addEventListener('DOMContentLoaded', tabs.init)

// event senders
document.querySelectorAll('.generator-info').forEach(li =>
	li.addEventListener('click', () => {
		const command = li.querySelector<HTMLDivElement>('.title').innerText.trim()
		parent.postMessage({ pluginMessage: { type: 'populate', category: tabs.curr, command: command } }, '*')
	})
)

document.querySelectorAll('.tag').forEach(tag =>
	tag.addEventListener('click', e => {
		e.stopPropagation()

		const name = (tag as HTMLDivElement).innerText
		let typeDom
		for (
			typeDom = tag.previousElementSibling;
			!typeDom.classList.contains('tag-group-heading') && typeDom !== null;
			typeDom = typeDom.previousElementSibling
		);

		const fieldType = typeDom.innerText.indexOf('Text') !== -1 ? 'text' : 'image'

		parent.postMessage({ pluginMessage: { type: 'rename', name, fieldType } }, '*')
	})
)

// event recievers
onmessage = e => {
	const msg = e.data.pluginMessage
	switch (msg.type) {
		case 'images':
			Promise.all(
				msg.images.map(({ url, key }) =>
					fetch(url)
						.then(res => res.arrayBuffer())
						.then(a => ({ data: new Uint8Array(a), key }))
				)
			)
				.then(imgs => parent.postMessage({ pluginMessage: { type: 'images', images: imgs } }, '*'))
				.catch(err => parent.postMessage({ pluginMessage: { type: 'error', message: err } }, '*'))
			break
		case 'pinned-tab':
			tabs.activate(msg.tab)
			break
	}
}

// state handling
document.querySelectorAll('li').forEach(li => {
	li.addEventListener('mousedown', () => {
		li.classList.add('active')
		document.addEventListener('mouseup', () => li.classList.remove('active'), { once: true })
	})
})

document.querySelectorAll('.tag').forEach(tag => {
	tag.addEventListener('mousedown', e => {
		e.stopPropagation()
		tag.classList.add('active')

		document.addEventListener(
			'mouseup',
			e => {
				e.stopPropagation()
				tag.classList.remove('active')
			},
			{ once: true }
		)
	})
})
