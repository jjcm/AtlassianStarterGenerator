import populate from '../populate'
import { shuffle } from '../util'
import data from '../data'
import { getShuffledHumans } from './user'

const { pages, globalSpaces } = data.confluence
const { projectAvatars } = data.jira

const pageBodies = pages.linked.map(page => page.body)

const globalSpaceAvatarKeys = shuffle(projectAvatars.map(({ key }) => key))
const globalSpaceData = {
	avatars: globalSpaceAvatarKeys,
	all: globalSpaces.map(({ key, name }, i) => ({
		avatar: globalSpaceAvatarKeys[i % globalSpaceAvatarKeys.length],
		key,
		name
	})),
	keys: globalSpaces.map(space => space.key),
	names: globalSpaces.map(space => space.name)
}

const meepleSpaces = {
	all: data.user.meeple.map(({ name, username, avatar }) => ({
		name,
		avatar,
		key: username
	})),
	avatars: data.user.meeple.map(({ avatar }) => avatar)
}

/* eslint-disable prettier/prettier */
const personalSpaces = {
	get all() {
		return getShuffledHumans().map(({ name, username, avatar }) => ({ name, avatar, key: username }))
	},
	get avatars() { return getShuffledHumans().map(({ avatar }) => avatar) },
	get keys() { return getShuffledHumans().map(user => user.username) },
	get names() { return getShuffledHumans().map(user => user.name) }
}
/* eslint-enable prettier/prettier */

export default {
	Page: () => populate(pages.linked, { linked: true }),
	'Page Title': () => populate(pages.titles),
	'Page Body': () => populate(pageBodies),
	'Space (Global)': () => populate(globalSpaceData.all, { linked: true, imageLayers: ['avatar'] }),
	'Space (Meeple)': () => populate(meepleSpaces.all, { linked: true, imageLayers: ['avatar'] }),
	'Space (Personal)': () => populate(personalSpaces.all, { linked: true, imageLayers: ['avatar'], shuffled: true }),
	'Space Avatar (Global)': () => populate(globalSpaceData.avatars, { imageLayers: true }),
	'Space Avatar (Meeple)': () => populate(meepleSpaces.avatars, { imageLayers: true }),
	'Space Avatar (Personal)': () => populate(personalSpaces.avatars, { imageLayers: true, shuffled: true }),
	'Space Key (Global)': () => populate(globalSpaceData.keys),
	'Space Key (Personal)': () => populate(personalSpaces.keys, { shuffled: true }),
	'Space Name (Global)': () => populate(globalSpaceData.names),
	'Space Name (Personal)': () => populate(personalSpaces.names, { shuffled: true })
}
