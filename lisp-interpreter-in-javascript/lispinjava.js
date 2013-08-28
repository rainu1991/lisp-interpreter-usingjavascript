function read(s)
{
	return read_from(tokenize(s));
}


function tokenize(s)
{
	return s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/); 
}

function read_from(tokens)
{
	if (tokens.length == 0)
	{	
		 console.log("Unexpected EOF while reading");
	}
	var token = tokens.shift();
	if (token == '(')
	{
		var L = [];
		while (tokens[0] != ')')
			L.push(read_from(tokens));
		tokens.shift();
		return L;
	}

	else
	{ 
		if (token == ')')
		{
			console.log("Unexpected");
		}
		else
			return atom(token);
	}
}

function atom(token)
{
	if(isNaN(token))
		return token;
	else
		return parseFloat(token);
}

function eval(x,env)
{
	var i;
	env = env || globalenv;
	if(typeof x == 'string')
	{
		return env.find(x.valueOf())[x.valueOf()];
	}
	else if(typeof x == 'number')
	{
		return x;
	}
	else if(x[0] == 'quote')
	{
		return x[1];
	}
	else if(x[0] == 'if')
	{
		var test = x[1];		
		var conseq = x[2];
		var alt = x[3];
		if(eval(test,env))
		{
			return eval(conseq,env);
		}
		else
		{
			return eval(alt,env);
		}
	}
	else if(x[0] == 'set!')
	{
		env.find(x[1])[x[1]] = eval(x[2],env);
	}
	else if(x[0] == 'define')
	{
		env[x[1]] = eval(x[2],env);
	}
	else if(x[0] == 'lambda')
	{
		var vars = x[1];
		var exp  = x[2];
		return function()
		{
			return eval(exp,Env({pars: vars, args: arguments, outer:env}));
		}
	}
	else if(x[0] == 'begin')
	{
		var val;
		for(i = 1;i < x.length;i = i+1)
		{
			val = eval(x[i], env);
		}
		return val;
	}
	else
	{
		var exps = [],proc;
		for(i = 0;i < x.length;i = i+1)
		{
			exps[i] = eval(x[i],env);
		}
		proc = exps.shift();
		return proc.apply(env,exps);
	}
};		
		

var Symbol = String;
function addglobals(env)
{
	
	env['+'] = function (x,y){return x+y}
	env['-'] = function (x,y){return x-y;}
	env['*'] = function (x,y){return x*y;}
	env['/'] = function (x,y){return x/y;}
	env['not'] = function (x){return !x;}
	env['>'] = function (x,y){return x>y;}
	env['<'] = function (x,y){return x<y;}
	env['>='] = function (x,y){return x>=y;}
	env['<='] = function (x,y){return x<=y;}
	env['='] = function (x,y){return x=y;}
	env['equal?'] = function (x,y){return x==y;}
	env['eq?'] = function (x,y){return x==y;}
	env['length'] = function (x,y){return x.length;} 
	env['cons'] = function (x,y){return [x].concat(y);}
	env['car'] = function (x){return x[0];}
	env['cdr'] = function (x){return x.slice(1);}
	env['append'] = function (x,y){return x.concat(y);}
	env['list'] = function (){ return Array.prototype.slice.call(arguments);}
	env['list?'] = function (x){return (x instanceof Array);} 
	env['null?'] = function (x){return (!x || x.length == 0);} 
	env['symbol?'] = function (x){return (x instanceof String);}
	return env;
	
};
var globalenv = addglobals(Env({pars: [], args: []}));

				
var parse = read;

function repl()
{
	var input = '(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))';
	input = input.toString();
	var val = eval(parse(input));
	input = '(fact 10)'
	val = eval(parse(input));
	console.log('Result='+val);
		
}

function Env(pao)
{
	    var i, env = {}, outer = pao.outer || {};
        
	    function get_outer() 
	    {
                return outer;
            };
        
	    function find(variable) 
	    {
            	if (env.hasOwnProperty(variable)) 
		{
                        return env;
                } 
		else 
		{
            	       return outer.find(variable);
                }
	    };
    
	  if (0 !== pao.pars.length) 
		{
			for (i = 0; i < pao.pars.length; i += 1) 
			{
				env[pao.pars[i]] = pao.args[i];
        		}
		}

	  env.get_outer = get_outer;
	  env.find = find;
    
          return env;
};


  
repl()

