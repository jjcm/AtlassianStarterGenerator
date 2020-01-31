//import handlers from './handlers'
import { rename, error, fetchAllImages, setPinnedTab, getPinnedTab } from './util'

figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })

figma.showUI(__html__)
figma.ui.resize(368, 548)

figma.ui.onmessage = msg => {
	console.log(msg)
	switch (msg.type) {
		case 'populate': {
			//const count = handlers[msg.category][msg.command]()
			break
		}
		case 'images':
			msg.images.forEach(({ data, key }) => {
				const { hash } = figma.createImage(data)
				figma.clientStorage.setAsync('images.' + key, hash)
			})
			break
		case 'rename':
			rename(msg.name, msg.fieldType)
			break
		case 'tab-change':
			//setPinnedTab(msg.id)
			break
		case 'error':
			//error(msg.message)
			break
	}
}

getPinnedTab().then(tab => figma.ui.postMessage({ type: 'pinned-tab', tab }))
//fetchAllImages()
