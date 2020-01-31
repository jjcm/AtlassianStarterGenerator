import { shuffle, error } from './util'

type Data = Array<string | object> | Function
type PopulateOptions = {
	// if linked == true, will access field of data[i], otherwise data[i] is assumed to be a string
	linked?: boolean
	// defaults to false, but if shuffled, will not reshuffle (ie. heroes + humans will be pre-shuffled)
	shuffled?: boolean
	// names of layers that are to be filled with images, not text
	imageLayers?: Array<string> | true
}

/**
 * @param data data array. Pass a function in **only if** the data is randomly generated (like dates).
 * @param options options object, specified above
 * @param nodes the array of nodes to populate
 * @param index **DO NOT SET.** Internal use only.
 */
const populate = (
	data: Data,
	options: PopulateOptions = {},
	nodes: ReadonlyArray<SceneNode> = figma.currentPage.selection,
	index: number = 0
): number => {
	if (!options.shuffled && !(data instanceof Function)) {
		data = shuffle(data)
		options.shuffled = true
	}
	let count = 0
  let offset = 0
	nodes.forEach(node => {
		if (!canPopulate(node)) return
		const key = node.name.toLowerCase().trim()

		if ("children" in node) count += populate(data, options, node.children, index + ++offset)
		else if (options.imageLayers && "fills" in node && node.type !== 'TEXT' && node.type !== 'VECTOR') {
			if (options.linked) {
        let layers = options.imageLayers as Array<string>
				if (!layers.includes(key)) return

				const imgKey = data[index % data.length][key]
				count++
				setImageFill(node, imgKey)
			} else {
				const imgKey = data[index % data.length]
				count++
				setImageFill(node, imgKey)
				index++
			}
		} else if (node.type === 'TEXT' && options.imageLayers !== true) {
			if (node.hasMissingFont) return missingFont(node)

			if (data instanceof Function) {
				figma.loadFontAsync(node.fontName as FontName).then(() => (node.characters = (data as Function)()))
				count++
			} else if (options.linked) {
				if (!(key in (data[index] as object))) return

				figma.loadFontAsync(node.fontName as FontName).then(() => {
					node.characters = (data as Array<object>)[index % data.length][key]
					node.name = key
				})
				count++
			} else {
				figma
					.loadFontAsync(node.fontName as FontName)
					.then(() => (node.characters = (data as Array<string>)[index++ % data.length]))
				count++
			}
		}
	})
	return count
}

const setImageFill = (node: DefaultShapeMixin, key: string) => {
	// hacky way to identify style key vs. image hash
	if (key.indexOf('.') !== -1) {
		getImageHashByName(key).then(hash => {
			if (hash) (node as DefaultShapeMixin).fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: hash }]
			else error(`Image "${key}" not found, please send a message to #design-system-tools`)
		})
	} else {
		figma
			.importStyleByKeyAsync(key)
			.then(({ id }) => ((node as DefaultShapeMixin).fillStyleId = id))
			.catch(error)
	}
}

const getImageHashByName = (name: string): Promise<any | undefined> => figma.clientStorage.getAsync('images.' + name)

function missingFont(node: TextNode) {
	error(`Missing font: ${JSON.stringify(node.fontName)}`)
	// return figma.loadFontAsync({ family: 'SF Pro Text', style: 'Regular' }).then(() => {node.fontName = { family: 'SF Pro Text', style: 'Regular' }})
}

const canPopulate = (node: SceneNode) => {
	if (!("visible" in node)) return false

	if (!node.getSharedPluginData('adgfigmaplugin', 'immutable')) {
		if (node.type === 'INSTANCE' && node.masterComponent.getSharedPluginData('adgfigmaplugin', 'immutable'))
			return false
		else if (getMasterInstance(node)?.getSharedPluginData('adgfigmaplugin', 'immutable')) return false

		return true
	}

	return false
}

const getMasterInstance = (node: SceneNode): SceneNode | null => {
	let parent = node.parent
	while (parent !== null && parent.type !== 'PAGE') {
		if (parent.type === 'INSTANCE') break
		parent = parent.parent
	}

	if (!parent || parent.type !== 'INSTANCE') return null

	const masterInstance = parent.masterComponent.children.find(n => n.name === node.name)
	return masterInstance ?? parent.masterComponent.findOne(n => n.name === node.name)
}

export default populate
