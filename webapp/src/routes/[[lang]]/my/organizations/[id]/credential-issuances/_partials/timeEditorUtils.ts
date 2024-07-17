import { intervalToDuration, toDate, getUnixTime } from 'date-fns';
import { m } from '$lib/i18n';

//

export type TimeData = {
	y: number;
	m: number;
	d: number;
};

export type TimeMode = 'date' | 'duration';

type TimeLabels = {
	[k in keyof TimeData]: string;
};

// Time -> TimeData

export function timeToTimeData(time: number, mode: TimeMode): TimeData {
	switch (mode) {
		case 'date':
			return timeToDate(time);
		case 'duration':
			return timeToDuration(time);
	}
}

function timeToDuration(time: number): TimeData {
	const duration = intervalToDuration({ start: 0, end: time });
	return {
		y: duration.years ?? 0,
		m: (duration.months ?? 0) + 1,
		d: (duration.days ?? 0) + 1
	};
}

function timeToDate(time: number): TimeData {
	const date = toDate(time);
	return {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate()
	};
}

// TimeData ->  Time

export function timeDataToTime(timeData: TimeData, mode: TimeMode) {
	switch (mode) {
		case 'date':
			return timeDataToDate(timeData);
		case 'duration':
			return timeDataToDuration(timeData);
	}
}

function timeDataToDuration(timeData: TimeData): number {
	const DAY = 60 * 60 * 24;
	const MONTH = DAY * 30;
	const YEAR = MONTH * 12;
	return timeData.y * YEAR + timeData.m * MONTH + timeData.d * DAY;
}

function timeDataToDate(timeData: TimeData): number {
	const date = new Date(timeData.y, timeData.m - 1, timeData.d);
	return getUnixTime(date);
}

// Labels

export function getLabels(mode: TimeMode): TimeLabels {
	switch (mode) {
		case 'date':
			return {
				y: m.Year(),
				m: m.Month(),
				d: m.Day()
			};
		case 'duration':
			return {
				y: m.Years(),
				m: m.Months(),
				d: m.Days()
			};
	}
}
