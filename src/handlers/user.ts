import populate from '../populate'
import { shuffle } from '../util'
import data from '../data'

const { heroes, humans, meeple } = data.user

/* eslint-disable prettier/prettier */
const humanData = {
	get all() { return getShuffledHumans(human => ({ ...human, email: `${human.username}@atlassian.com`, handle: `@${human.username}` })) },
	get avatar() { return getShuffledHumans(human => human.avatar) },
	get email() { return getShuffledHumans(human => `${human.username}@atlassian.com`) },
	get handle() { return getShuffledHumans(human => `@${human.username}`) },
	get name() { return getShuffledHumans(human => human.name) },
	get username() { return getShuffledHumans(human => human.username) }
}
/* eslint-enable prettier/prettier */

const meepleData = {
	all: meeple.map(meeple => ({
		...meeple,
		email: `${meeple.username}@atlassian.com`,
		handle: `@${meeple.username}`
	})),
	avatar: meeple.map(({ avatar }) => avatar)
}

export default {
	'Avatar (Human)': () => populate(humanData.avatar, { imageLayers: true, shuffled: true }),
	'Avatar (Meeple)': () => populate(meepleData.avatar, { imageLayers: true }),
	'@ Handle': () => populate(humanData.handle, { shuffled: true }),
	'Email Address': () => populate(humanData.email, { shuffled: true }),
	Human: () => populate(humanData.all, { linked: true, imageLayers: ['avatar'], shuffled: true }),
	Meeple: () => populate(meepleData.all, { linked: true, imageLayers: ['avatar'] }),
	Name: () => populate(humanData.name),
	Username: () => populate(humanData.username)
}

interface Human {
	name: string
	username: string
	avatar: string
}
export function getShuffledHumans(transform?: Function) {
  transform = transform || function(humans) {return humans}
	const shuffledHeroes = shuffle(heroes)
	const shuffledHumans = shuffle(humans)

	const allHumans = []
	for (let i = shuffledHeroes.length + shuffledHumans.length; i > 0; i--) {
		if (Math.random() < 0.8 && shuffledHeroes.length > 0) allHumans.push(transform(shuffledHeroes.pop()))
		else allHumans.push(transform(shuffledHumans.pop()))
	}

	return allHumans
}
