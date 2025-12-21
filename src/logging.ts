/*
    Copyright (C) 2025  Littux-Dustux

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export class notify {
	private activeNotifications: { id: string; element: HTMLDivElement }[] = [];
	constructor() {}

	_show(message: string, isError = false): void {
		const notificationId = "notification-" + Date.now();
		const notification = document.createElement("div");
		notification.id = notificationId;
		notification.textContent = message;

		Object.assign(notification.style, {
			position: "fixed",
			right: "10px",
			padding: "10px 15px",
			borderRadius: "5px",
			zIndex: "2147483647",
			color: "white",
			fontFamily: "Arial, sans-serif",
			fontSize: "14px",
			opacity: "0",
			transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
			backgroundColor: isError ? "#d9534f" : "#5cb85c",
		} as Partial<CSSStyleDeclaration>);

		this.activeNotifications.push({
			id: notificationId,
			element: notification,
		});

		document.body.appendChild(notification);
		this.updateNotificationPositions();

		requestAnimationFrame(() => {
			notification.style.opacity = "1";
		});

		setTimeout(() => {
			notification.style.opacity = "0";
			notification.style.transform = "translateX(100%)";

			setTimeout(() => {
				if (notification.parentNode) {
					notification.parentNode.removeChild(notification);
					this.activeNotifications = this.activeNotifications.filter(
						(n) => n.id !== notificationId
					);
					this.updateNotificationPositions();
				}
			}, 300);
		}, 3000);
	}

	updateNotificationPositions(): void {
		this.activeNotifications.forEach((notification, index) => {
			const topPosition = 10 + index * (44 + 10);
			notification.element.style.top = `${topPosition}px`;
		});
	}

	log(message: string): void {
		this._show(message, false);
	}
	error(message: string): void {
		this._show(message, true);
	}
}

type LogLevel = "dbg" | "inf" | "wrn" | "err" | "log";

const logFuncMap = {
	dbg: console.debug,
	inf: console.info,
	wrn: console.warn,
	err: console.error,
	log: console.log,
};

const logColorMap = {
	dbg: "#555",
	inf: "#00ccff",
	wrn: "orange",
	err: "red",
	log: "#fff"
};

const logEmojiMap = {
	dbg: "" /*"🐛"*/,
	inf: "" /*"ℹ️"*/,
	wrn: "⚠️ ",
	err: "❌ ",
	log: ""
};

class Logger {
	loggerDiv: HTMLDivElement;
	logHistory: string[] = [];
	maxHistory: number;

	constructor({
		logOutputDiv,
		maxHistory = 10000,
	}: {
		logOutputDiv?: HTMLDivElement;
		maxHistory?: number;
	}) {
		if (logOutputDiv instanceof HTMLDivElement) this.loggerDiv = logOutputDiv;
		this.maxHistory = maxHistory;
	}

	private format(level: LogLevel, func: string, msg: string) {
		const ts = new Date().toLocaleString().replace(",", "");
		return "[" + ts + "][" + level + "][" + func + "] " + logEmojiMap[level] + msg;
	}

	/** Function to render log with color to the loggerDiv */
	private divLog(level: LogLevel, msg: string): void {
		if (this.loggerDiv instanceof HTMLDivElement) {
			const logEntry = document.createElement("span");
			logEntry.className = "log-entry";
			logEntry.textContent = msg + "\n";
			logEntry.style.color = logColorMap[level];

			this.loggerDiv.appendChild(logEntry);
			this.loggerDiv.scrollTop = this.loggerDiv.scrollHeight;
		} else {
			this.logHistory.push(msg);
			if (this.logHistory.length > this.maxHistory) {
				this.logHistory.shift();
			}
		}
	}

	async log(level: LogLevel, msg: string, func) {
		const text = this.format(level, func, msg);
		this.divLog(level, text);
		logFuncMap[level](text);
		return text;
	}

	async copyToClipboard() {
		let text: string;
		if (this.loggerDiv instanceof HTMLDivElement) text = this.loggerDiv.textContent;
		else text = this.logHistory.join("\n");
		await navigator.clipboard.writeText(text);
	}
}

export const globalLogger = new Logger({});

export function getLogger(funcName: string) {
	return {
		dbg: (msg: string) => globalLogger.log("dbg", msg, funcName),
		inf: (msg: string) => globalLogger.log("inf", msg, funcName),
		wrn: (msg: string) => globalLogger.log("wrn", msg, funcName),
		err: (msg: string) => globalLogger.log("err", msg, funcName),
		log: (msg: string) => globalLogger.log("log", msg, funcName),
	};
}