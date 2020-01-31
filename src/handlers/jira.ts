import populate from '../populate'
import { shuffle } from '../util'
import data from '../data'

const { issues, projects, projectAvatars } = data.jira

// const componentDescriptions = data.jira.components.map(component => component.description)
// const componentNames = data.jira.components.map(component => component.name)

const issueData = {
	all: issues.linked.map((issue, i) => ({
		...issue,
		description: issues.descriptions[i % issues.descriptions.length],
		'priority icon': `issue.priority.${issue['priority icon']}`,
		'type icon': `issue.type.${issue['type icon']}`
	})),
	keys: issues.linked.map(issue => issue.key),
	priorities: issues.linked.map(issue => issue.priority),
	priroityIcons: ['blocker', 'critical', 'high', 'highest', 'low', 'lowest', 'major', 'medium', 'minor', 'trivial'].map(
		priority => `issue.priority.${priority}`
	),
	resolutions: [...new Set(issues.linked.map(issue => issue.resolution))] as Array<string>,
	statuses: issues.linked.map(issue => issue.status),
	summaries: issues.linked.map(issue => issue.summary),
	types: issues.linked.map(issue => issue.type),
	typeIcons: [
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
	].map(type => `issue.type.${type}`)
}

const projectAvatarKeys = shuffle(projectAvatars.map(({ key }) => key))
const projectData = {
	all: projects.map((project, i) => ({
		...project,
		type: (Math.random() < 0.5 ? 'Next-gen ' : 'Classic ') + project.type,
		avatar: projectAvatarKeys[i % projectAvatarKeys.length]
	})),
	avatars: projectAvatarKeys,
	keys: projects.map(project => project.key),
	names: projects.map(project => project.name),
	types: [
		'Next-gen Software',
		'Classic Software',
		'Next-gen Service Desk',
		'Classic Service Desk',
		'Next-gen Business',
		'Classic Business'
	]
}

export default {
	// "Component": () => populate(data.jira.components, { linked: true }),
	// "Component Description": () => populate(componentDescriptions),
	// "Component Name": () => populate(componentNames),
	Issue: () => populate(issueData.all, { linked: true, imageLayers: ['priority icon', 'type icon'] }),
	'Issue Description': () => populate(issues.descriptions),
	'Issue Key': () => populate(issueData.keys),
	'Issue Priority': () => populate(issueData.priorities),
	'Issue Priority Icon': () => populate(issueData.priroityIcons, { imageLayers: true }),
	'Issue Resolution': () => populate(issueData.resolutions),
	'Issue Status': () => populate(issueData.statuses),
	'Issue Summary': () => populate(issueData.summaries),
	'Issue Type': () => populate(issueData.types),
	'Issue Type Icon': () => populate(issueData.typeIcons, { imageLayers: true }),
	Project: () => populate(projectData.all, { linked: true, imageLayers: ['avatar', 'type icon'] }),
	'Project Avatar': () => populate(projectData.avatars, { imageLayers: true }),
	'Project Key': () => populate(projectData.keys),
	'Project Name': () => populate(projectData.names),
	'Project Type': () => populate(projectData.types)
}
