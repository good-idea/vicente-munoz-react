import parser from 'html-react-parser'
import R from 'ramda'
import { markdown } from 'markdown'

/**
 * Modify the Markdown string. Use these before converting
 */

export const fixKirbyTextAnchors = text =>
	text.replace(/(\(link:\s?(\S*))\stext:\s?([\S ]*)\)/g, '[$3]($2)')

/**
 * Convert Markdown to HTML
 */

export const markdownToHTML = markdown.toHTML

/**
 * Edit HTML String
 */

export const removeWrappingTags = text =>
	text.replace(/(<[\S]+>)(.*)(<\/[\S]+>)/g, '$2')

export const stripTags = allowed => text => {
	allowed = (
		((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
	).join('')
	const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
	const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
	return text
		.replace(commentsAndPhpTags, '')
		.replace(
			tags,
			(b, a) => (allowed.indexOf(`<${a.toLowerCase()}>`) > -1 ? b : ''),
		)
}

export const externalLinks = text =>
	text.replace(/(<a\W?)(href="https?:\/\/)/, '$1 target="_blank" $2')

export const trimText = length => text => text.substr(0, length)

/**
 * Convert HTML to JSX
 */

export const HTMLtoJSX = text => parser(text)

/**
 * Common pipes
 */

const prepareAside = R.pipe(
	fixKirbyTextAnchors,
	markdownToHTML,
	externalLinks,
	stripTags('<a>'),
	HTMLtoJSX,
)

const preparePreview = R.pipe(
	fixKirbyTextAnchors,
	markdownToHTML,
	stripTags(''),
	removeWrappingTags,
	HTMLtoJSX,
)

const markdownToJSX = R.pipe(
	fixKirbyTextAnchors,
	markdownToHTML,
	externalLinks,
	HTMLtoJSX,
)

module.exports = {
	fixKirbyTextAnchors,
	markdownToHTML,
	HTMLtoJSX,
	removeWrappingTags,
	externalLinks,
	prepareAside,
	preparePreview,
	markdownToJSX,
}
