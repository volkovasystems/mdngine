
const mdngine = require( "./mdngine.js" );

console.log( mdngine( true ) );

console.log( mdngine( "3.4.4", true ) );

mdngine( )( function done( ){
	console.log( arguments );
} );

mdngine( "3.4.4" )( function done( ){
	console.log( arguments );
} );
