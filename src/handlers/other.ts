import populate from '../populate'

export default {
	Date: () => populate(getDate)
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function getDate() {
	let date = new Date()
	date = new Date(date.getTime() + Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000 * (Math.random() * 4 - 2)))
	return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}
