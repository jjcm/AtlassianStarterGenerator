
// taken from: https://javascript.info/task/shuffle
export const shuffle = (arr: Array<any>) => {
	const newArr = [...arr]
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
	}
	return newArr
}

export const rename = (
	name: string,
	type: 'text' | 'image',
	nodes: ReadonlyArray<SceneNode> = figma.currentPage.selection
) => {
	let count = 0
	nodes.forEach(node => {
		if (type === 'text' && node.type === 'TEXT') {
			node.name = name
			count++
		} else if (type === 'image' && "fills" in node && !("children" in node) && node.type !== 'TEXT') {
			node.name = name
			count++
		}
	})

}

const PINNED_TAB_KEY = 'pinned-tab'
export const setPinnedTab = (tabId: string): void => {
	figma.clientStorage.setAsync(PINNED_TAB_KEY, tabId)
}

export const getPinnedTab = (): Promise<string> =>
	figma.clientStorage.getAsync(PINNED_TAB_KEY).then(tab => tab || 'bitbucket')

export const error = msg => {
	figma.notify(msg)
}

export const fetchAllImages = () => {
	const HOST = 'https://proto.atlassian.design/cdn'
	const filenames = [
		...['blocker', 'critical', 'high', 'highest', 'low', 'lowest', 'major', 'medium', 'minor', 'trivial'].map(name => ({
			url: `${HOST}/issue/priority/${name}.png`,
			key: `issue.priority.${name}`
		})),
		...[
			'blog',
			'bug',
			'change',
			'epic',
			'help',
			'improvement',
			'incident',
			'initiative',
			'new-feature',
			'problem',
			'purchase',
			'story',
			'sub-task',
			'support',
			'task',
			'travel-provider'
		].map(name => ({ url: `${HOST}/issue/type/${name}.png`, key: `issue.type.${name}` })),
		...[
			'blog',
			'branch',
			'bug',
			'calendar',
			'changes',
			'code',
			'commit',
			'improvement',
			'incident',
			'issue',
			'new-feature',
			'page',
			'problem',
			'pull-request',
			'question',
			'story',
			'subtask',
			'task',
			'comment'
		].map(name => ({ url: `${HOST}/request/${name}.png`, key: `request.${name}` }))
	]
	figma.ui.postMessage({ type: 'images', images: filenames })
}
