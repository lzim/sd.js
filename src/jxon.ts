// Copyright 2015 Bobby Powers. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.

'use strict';

declare function isFinite(n: string|number): boolean;

/*function isObject(v) {
  return typeof v === 'object';
  }*/

function parseText(val: string): string|boolean|number {
	'use strict';

	val = val.trim();
	if (/^\s*$/.test(val))
		return null;
	if (/^(?:true|false)$/i.test(val))
		return val.toLowerCase() === 'true';
	if (isFinite(val))
		return parseFloat(val);

	return val;
}

// FIXME: find type of parent
export function build(parent: any): any {
	'use strict';

	let hasAttrs = false;
	let result: any = true;
	let collectedText = '';

	if (parent.hasAttributes()) {
		result = {};
		hasAttrs = true;
		for (let len = 0; len < parent.attributes.length; len++) {
			let attrib = parent.attributes.item(len);
			result['@' + attrib.name.toLowerCase()] = parseText(attrib.value);
		}
	}
	if (parent.hasChildNodes()) {
		for (let i = 0; i < parent.childNodes.length; i++) {
			let node = parent.childNodes.item(i);
			switch (node.nodeType) {
			case 4: // CData
				collectedText += node.nodeValue;
				break;
			case 3: // Text
				collectedText += node.nodeValue.trim();
				break;
			case 1: // Element
				if (!hasAttrs) {
					result = {};
					hasAttrs = true;
				}
				let prop = node.nodeName.toLowerCase();
				let content = jxonBuild(node);
				if (result.hasOwnProperty(prop)) {
					if (!(result[prop] instanceof Array))
						result[prop] = [result[prop]];
					result[prop].push(content);
				} else {
					result[prop] = content;
				}
				break;
			default:
				console.log('unknown nodeType: ' + node.nodeType);
			}
		}
	}
	if (collectedText) {
		if (hasAttrs) {
			result.keyValue = collectedText;
		} else {
			result = parseText(collectedText);
		}
	}
	return result;
}

export function unbuild(/*obj*/): any {
	'use strict';

	return;
}
