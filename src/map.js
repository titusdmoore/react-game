import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { Dimensions } from "react-native";
const height = Dimensions.get('window').height - (StaticSafeAreaInsets.safeAreaInsetsTop + StaticSafeAreaInsets.safeAreaInsetsBottom);
const width = Dimensions.get('window').width - (StaticSafeAreaInsets.safeAreaInsetsRight + StaticSafeAreaInsets.safeAreaInsetsLeft);

export default class Grid {
	constructor() {
		this.map = Array(Math.floor(width / 20)).fill(Array(Math.floor(height / 20)).fill(false));

		this.clear = this.clear.bind(this)
		this.setAreaTaken = this.setAreaTaken.bind(this)
		this.setTaken = this.setTaken.bind(this)
		this.findOpenArea = this.findOpenArea.bind(this)
		this.checkAreaOpen = this.checkAreaOpen.bind(this)
	}

	clear() {
		this.map = Array(Math.floor(width / 20)).fill(Array(Math.floor(height / 20)).fill(false));
	}

	setAreaTaken(startX, startY, size) {
		const area = Array(size * 2 + 2).fill(Array(size * 2 + 2).fill(false))
		startX += size
		startY += size

		area.map((yValues, x) => {
		 	yValues.map((taken, y) => {
		  		this.setTaken(startX - x, startY - y)
		 	})
		})
	}

	findOpenArea(size) {
		const openAreas = [];

		this.map.map((yValues, x) => {
		 	yValues.map((taken, y) => {
		 		if (!this.map[x][y]) {
		 			const open = this.checkAreaOpen(x, y, size);

		 			if (open) openAreas.push(open);
		 		}
			})
		})

		return openAreas;
	}

	checkAreaOpen(startX, startY, size) {
		const area = Array(size * 2 + 2).fill(Array(size * 2 + 2).fill(false))
		isOpen = [startX, startY];

		startX += size
		startY += size

		area.map((yValues, x) => {
		 	yValues.map((taken, y) => {
		 		const calcX = (startX - x);
		 		const calcY = (startY - y);
				if (calcX < 0 || calcY < 0 || calcX > (this.map.length - 1) || calcY > (this.map[0].length - 1) || this.map[calcX][calcY]) {
					isOpen = false;
				}
			})
		})

		return isOpen;
	}

	setTaken(x, y) {
		if (this.map[x]) {
			const yValues = this.map[x].slice(0);
			yValues[y] = true
			this.map[x] = yValues
		}
	}
}
