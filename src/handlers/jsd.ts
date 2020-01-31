import populate from '../populate'
import { shuffle } from '../util'
import data from '../data'

const { requests } = data.jsd

const typeIcons = shuffle(
	[
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
	].map(type => `request.${type}`)
)

const requestData = {
	all: requests.map((request, i) => ({ ...request, 'type icon': typeIcons[i % typeIcons.length] })),
	descriptions: requests.map(({ description }) => description),
	summaries: requests.map(({ summary }) => summary),
	types: [...new Set(requests.map(({ type }) => type))] as Array<string>,
	typeIcons: typeIcons
}
console.log(requestData)
export default {
	Request: () => populate(requestData.all, { linked: true, imageLayers: ['type icon'] }),
	'Request Description': () => populate(requestData.descriptions),
	'Request Summary': () => populate(requestData.summaries),
	'Request Type': () => populate(requestData.types),
	'Request Type Icon': () => populate(requestData.typeIcons, { imageLayers: true })
}
