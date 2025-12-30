export class notify {
	private static activeNotifications: { id: string; element: HTMLDivElement }[] = [];
	constructor() {}

	private static _show(message: string, isError = false): void {
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

	private static updateNotificationPositions(): void {
		this.activeNotifications.forEach((notification, index) => {
			const topPosition = 10 + index * (44 + 10);
			notification.element.style.top = `${topPosition}px`;
		});
	}

	static log(message: string): void {
		this._show(message, false);
	}
	static error(message: string): void {
		this._show(message, true);
	}
}

type LogLevel = "dbg" | "inf" | "log" | "wrn" | "err" | "crt";

const logFuncMap: { [K in LogLevel]: (...data: any) => void } = {
		dbg: console.debug,
		inf: console.info,
		log: console.log,
		wrn: console.warn,
		err: console.error,
		crt: console.error
	},
	logBGColorMap: { [K in LogLevel]: string } = {
		dbg: "#555",
		inf: "#0cf",
		log: "#fff",
		wrn: "#ff0",
		err: "#f00",
		crt: "#700",
	},
	logColorMap: { [K in LogLevel]: string } = {
		dbg: "#fff",
		inf: "#000",
		log: "#000",
		wrn: "#000",
		err: "#fff",
		crt: "#fff",
	},
	logEmojiMap: { [K in LogLevel]: string } = {
		dbg: "" /*"🐛"*/,
		inf: "" /*"ℹ️"*/,
		log: "",
		wrn: "⚠️ ",
		err: "❌ ",
		crt: "❌ ",
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
	private divLog(
		{level, msg, func, ts}: {level: LogLevel, msg: string, func: string, ts: string}
	): void {
		if (this.loggerDiv instanceof HTMLDivElement) {
			const logEntry = document.createElement("span");
			logEntry.className = "log-entry";

			const tsSpan = document.createElement("span");
			tsSpan.textContent = "[" + ts + "]";
			tsSpan.style.color = "#888";
			tsSpan.style.fontFamily = "monospace";

			const levelFuncSpan = document.createElement("span");
			levelFuncSpan.textContent = "[" + level + "][" + func + "] ";
			levelFuncSpan.style.borderRadius = "30px";
			levelFuncSpan.style.background = logBGColorMap[level];
			levelFuncSpan.style.color = logColorMap[level];
			levelFuncSpan.style.padding = "2px 4px";
			levelFuncSpan.style.fontFamily = "monospace";
			levelFuncSpan.style.fontWeight = "bold";

			const msgSpan = document.createElement("span");
			msgSpan.textContent = logEmojiMap[level] + msg + "\n";
			msgSpan.style.fontFamily = "monospace";

			logEntry.appendChild(tsSpan);
			logEntry.appendChild(levelFuncSpan);
			logEntry.appendChild(msgSpan);

			this.loggerDiv.appendChild(logEntry);
			this.loggerDiv.scrollTop = this.loggerDiv.scrollHeight;
		} else {
			const text = this.format(level, func, msg);
			this.logHistory.push(text);
			if (this.logHistory.length > this.maxHistory) {
				this.logHistory.shift();
			}
		}
	}

	async log(level: LogLevel, msg: string, func) {
		const ts = new Date().toLocaleString().replace(",", "");
		const text = this.format(level, func, msg);
		this.divLog({ level, msg, func, ts });
		logFuncMap[level](
			"%c["+func+"] %c"+level+"%c "+msg,
			"font-weight: bold",
			"font-weight: bold; padding: 1px 3px; border-radius: 4px; background: "+logBGColorMap[level]+"; color: "+logColorMap[level],
			""
		);
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
		log: (msg: string) => globalLogger.log("log", msg, funcName),
		wrn: (msg: string) => globalLogger.log("wrn", msg, funcName),
		err: (msg: string) => globalLogger.log("err", msg, funcName),
		crt: (msg: string) => globalLogger.log("crt", msg, funcName),
	};
}