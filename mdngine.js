"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "mdngine",
			"path": "mdngine/mdngine.js",
			"file": "mdngine.js",
			"module": "mdngine",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/mdngine.git",
			"test": "mdngine-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Get mongo database executable binary path.
	@end-module-documentation

	@include:
		{
			"depher": "depher",
			"emver": "emver",
			"falzy": "falzy",
			"gnaw": "gnaw",
			"pedon": "pedon",
			"prpath": "prpath",
			"raze": "raze",
			"truly": "truly",
			"zelf": "zelf"
		}
	@end-include
*/

const depher = require( "depher" );
const emver = require( "emver" );
const falzy = require( "falzy" );
const gnaw = require( "gnaw" );
const pedon = require( "pedon" );
const prpath = require( "prpath" );
const raze = require( "raze" );
const truly = require( "truly" );
const zelf = require( "zelf" );

const VERSION_PATTERN = /^(\d+?\.)+\d+?$/;
const VERSION = process.env.MONGO_DATABASE_VERSION || "";

const mdngine = function mdngine( version, synchronous, option ){
	/*;
		@meta-configuration:
			{
				"version": "string",
				"synchronous": "boolean",
				"option": "object"
			}
		@end-meta-configuration
	*/

	let parameter = raze( arguments );

	version = depher( parameter, VERSION_PATTERN, VERSION );

	synchronous = depher( parameter, BOOLEAN, false );

	option = depher( parameter, OBJECT, { } );

	if( synchronous === true ){
		try{
			var path = "";
			if( pedon.LINUX || pedon.OSX ){
				path = prpath( gnaw( "which mongod", true, option ) );

			}else if( pedon.WINDOWS ){
				//: @todo: Please implement this!
				throw new Error( "platform not currently supported" );

			}else{
				throw new Error( "cannot determine platform, platform not supported" );
			}

			if( truly( version ) || falzy( path ) ){
				path = gnaw( `m bin ${ version }`, true, option );
			}

			if( falzy( path ) ){
				version = emver( true, option );

				if( falzy( version ) ){
					throw new Error( "mongo database not installed" );
				}

				path = gnaw( `m bin ${ version }`, true, option );
			}

			return path;

		}catch( error ){
			throw new Error( `cannot get path to mongo database executable binary, ${ error.stack }` );
		}

	}else{
		let catcher = null;

		if( pedon.LINUX || pedon.OSX ){
			catcher = gnaw.bind( zelf( this ) )( "which mongod", option )
				.push( function done( error, path ){
					if( error instanceof Error ){
						return catcher.pass( new Error( `cannot get path to mongo database executable binary, ${ error.stack }` ), "" );

					}else if( truly( version ) || falzy( path ) ){
						return catcher.through( "m-bin-retrieval" );

					}else if( falzy( version ) && falzy( path ) ){
						return catcher.through( "emver-retrieval" );

					}else{
						return catcher.pass( null, prpath( path ) );
					}
				} );

		}else if( pedon.WINDOWS ){
			//: @todo: Please implement this!
			throw new Error( "platform not currently supported" );

		}else{
			throw new Error( "cannot determine platform, platform not supported" );
		}

		catcher.flow( "m-bin-retrieval", function mbinRetrieval( ){
			return gnaw( `m bin ${ version }`, option )( function done( error, path ){
				if( error instanceof Error ){
					return catcher.pass( new Error( `cannot get path to mongo database executable binary, ${ error.stack }` ), "" );

				}else if( falzy( path ) ){
					return catcher.through( "emver-retrieval" );

				}else{
					return catcher.pass( null, path );
				}
			} );
		} )
		.flow( "emver-retrieval", function emverRetrieval( ){
			return emver( option )( function done( error, version ){
				if( error instanceof Error ){
					return catcher.pass( new Error( `cannot get path to mongo database executable binary, ${ error.stack }` ), "" );

				}else if( falzy( version ) ){
					return catcher.pass( new Error( "mongo database not installed" ), "" );

				}else{
					return gnaw( `m bin ${ version }`, option )( function done( error, path ){
						if( error instanceof Error ){
							return catcher.pass( new Error( `cannot get path to mongo database executable binary, ${ error.stack }` ), "" );

						}else{
							return catcher.pass( null, path );
						}
					} );
				}
			} );
		} );

		return catcher;
	}
};

module.exports = mdngine;
