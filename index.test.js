const { delayedCB } = require("./index");

describe("Delayed Call Back utility function", () => {
	it("Passes sanity tests", () => {
		// That it has a module
		expect(delayedCB).toBeDefined();
		// That it is a function
		expect(typeof delayedCB).toBe("function");
	});
	describe("Error handling", () => {
		//
		it("Throws an error if argument is not an object", () => {
			const args = ["a", 1, null, undefined, false, function () {}, []];

			args.forEach((arg) => {
				expect(() => {
					delayedCB(arg);
				}).toThrow(Error);
			});
		});
		it("Throws an error if argument is an object without 'ms' number value", () => {
			const cb = () => {};
			const args = [
				{ cb },
				{ cb, ms: "a" },
				{ cb, ms: undefined },
				{ cb, ms: {} },
				{ cb, ms: [] },
			];

			args.forEach((arg) => {
				expect(() => {
					delayedCB(arg);
				}).toThrow(Error);
			});
		});
		it("Throws an error if argument is an object without 'cb' function value", () => {
			const ms = 1000;
			const args = [
				{ ms },
				{ ms, cb: "a" },
				{ ms, cb: undefined },
				{ ms, cb: {} },
				{ ms, cb: [] },
			];

			args.forEach((arg) => {
				expect(() => {
					delayedCB(arg);
				}).toThrow(Error);
			});
		});
	});

	describe("Requirements", () => {
		jest.useFakeTimers();
		it("Should allow the triggering of the delayed execution of another function – d.cb – by a certain amount of time d.ms", () => {
			// generates a number between 0 and 1000
			let randomMilliseconds = () => {
				return Math.random() * 1000;
			};

			const args = [{}, {}, {}, {}, {}, {}];

			args.forEach((arg) => {
				// setting a mock function
				arg.cb = jest.fn();

				// setting a random number of milliseconds
				arg.ms = randomMilliseconds();

				// call the function
				delayedCB(arg);

				// since we're waiting some amount of time before the expected behavior, our callback should not be imediately called
				expect(arg.cb).not.toBeCalled();

				// we advance the time to near that which is specified
				jest.advanceTimersByTime(arg.ms - 1);

				// ...our callback should still not be called
				expect(arg.cb).not.toBeCalled();

				// we advance the time to that specified
				jest.advanceTimersByTime(arg.ms);

				// it should be called
				expect(arg.cb).toBeCalled();

				// it should be called only once
				expect(arg.cb).toHaveBeenCalledTimes(1);
			});
		});
		it("an additional trigger should cancel the previous setTimeout trigger if < 500ms has passed since the previous trigger", () => {
			// assuming that the milliseconds set for the timeout will be >= 500 ms
			let randomMilliseconds = (min = 0, max = 1000) => {
				return Math.random() * (max - min) + min;
			};

			const args = [{}, {}, {}, {}, {}, {}];

			args.forEach((arg) => {
				// setting a mock function
				arg.cb = jest.fn();

				// setting a random number of milliseconds >= 500 milliseconds
				arg.ms = randomMilliseconds(500);

				// call the function
				delayedCB(arg);

				// wait a random amount of time < 500 millisecond
				const waitDuration = randomMilliseconds(0, 499);
				jest.advanceTimersByTime(waitDuration);

				expect(arg.cb).toHaveBeenCalledTimes(0);
				// call the function again
				delayedCB(arg);

				// advance the time to that which the initial trigger set the timeout for
				jest.advanceTimersByTime(arg.ms - waitDuration);
				expect(arg.cb).toHaveBeenCalledTimes(0);
				// it should be called at this time

				jest.advanceTimersByTime(arg.ms);
				expect(arg.cb).toHaveBeenCalledTimes(1);
			});
		});
		it("it should set timeout for last trigger if triggered many times", () => {
			const args = [{}, {}, {}, {}, {}, {}];

			for (let i = 0; i < args.length; i++) {
				// assigning ms and cb to the object each iteration
				args[i].ms = 500;
				args[i].cb = jest.fn();

				// passing the object as argument to a call of delayedCB
				delayedCB(args[i]);
			}
			// Andvancing time to the upper limit of timeout
			jest.advanceTimersByTime(499);

			// ...expecting that nothing has been called
			args.forEach((arg) => {
				expect(arg.cb).toHaveBeenCalledTimes(0);
			});

			// advance time to just past upper limit
			jest.advanceTimersByTime(1);

			// expect the last object's argument should be called
			let lastArg = args[args.length - 1];
			expect(lastArg.cb).toHaveBeenCalledTimes(1);

			// checking the rest after removing our 'lastArg'
			args.pop();
			args.forEach((arg) => {
				expect(arg.cb).toHaveBeenCalledTimes(0);
			});
		});
	});
});
