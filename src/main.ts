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

import rAPIcore from "./requests";
import rAPI from "./client";
import * as util from "./util";
import * as logging from "./logging";

// Manual global assignment for the browser
(window as any).rAPIcore = rAPIcore;
(window as any).rAPI = rAPI;
(window as any).util = util;
(window as any).logging = logging;

// Keep exports so the bundler and type-checker can see them
export { rAPIcore, rAPI, util, logging };