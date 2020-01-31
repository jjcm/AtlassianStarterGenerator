import populate from '../populate'
import { shuffle } from '../util'
import data from '../data'

const { branches, commits, pullRequests, repositories } = data.bitbucket

const projectAvatarKeys = shuffle(data.jira.projectAvatars.map(({ key }) => key))
const filteredProjects = data.jira.projects.map(({ key, name }, i) => ({
	avatar: projectAvatarKeys[i % projectAvatarKeys.length],
	key,
	name
}))

const projects = {
	all: filteredProjects,
	avatars: projectAvatarKeys,
	keys: filteredProjects.map(project => project.key),
	names: filteredProjects.map(project => project.name)
}

const pullRequestDescriptions = pullRequests.linked.map(pr => pr.description)

export default {
	'Branch Name': () => populate(branches),
	'Commit Name': () => populate(commits),
	Project: () => populate(projects.all, { linked: true, imageLayers: ['avatar'] }),
	'Project Avatar': () => populate(projects.avatars, { imageLayers: true }),
	'Project Key': () => populate(projects.keys),
	'Project Name': () => populate(projects.names),
	'Pull Request': () => populate(pullRequests.linked, { linked: true }),
	'Pull Request Description': () => populate(pullRequestDescriptions),
	'Pull Request Name': () => populate(pullRequests.names),
	'Repository Name': () => populate(repositories)
}
