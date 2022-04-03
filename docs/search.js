window.pdocSearch = (function(){
/** elasticlunr - http://weixsong.github.io * Copyright (C) 2017 Oliver Nightingale * Copyright (C) 2017 Wei Song * MIT Licensed */!function(){function e(e){if(null===e||"object"!=typeof e)return e;var t=e.constructor();for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}var t=function(e){var n=new t.Index;return n.pipeline.add(t.trimmer,t.stopWordFilter,t.stemmer),e&&e.call(n,n),n};t.version="0.9.5",lunr=t,t.utils={},t.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),t.utils.toString=function(e){return void 0===e||null===e?"":e.toString()},t.EventEmitter=function(){this.events={}},t.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),n=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");n.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},t.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var n=this.events[e].indexOf(t);-1!==n&&(this.events[e].splice(n,1),0==this.events[e].length&&delete this.events[e])}},t.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)},this)}},t.EventEmitter.prototype.hasHandler=function(e){return e in this.events},t.tokenizer=function(e){if(!arguments.length||null===e||void 0===e)return[];if(Array.isArray(e)){var n=e.filter(function(e){return null===e||void 0===e?!1:!0});n=n.map(function(e){return t.utils.toString(e).toLowerCase()});var i=[];return n.forEach(function(e){var n=e.split(t.tokenizer.seperator);i=i.concat(n)},this),i}return e.toString().trim().toLowerCase().split(t.tokenizer.seperator)},t.tokenizer.defaultSeperator=/[\s\-]+/,t.tokenizer.seperator=t.tokenizer.defaultSeperator,t.tokenizer.setSeperator=function(e){null!==e&&void 0!==e&&"object"==typeof e&&(t.tokenizer.seperator=e)},t.tokenizer.resetSeperator=function(){t.tokenizer.seperator=t.tokenizer.defaultSeperator},t.tokenizer.getSeperator=function(){return t.tokenizer.seperator},t.Pipeline=function(){this._queue=[]},t.Pipeline.registeredFunctions={},t.Pipeline.registerFunction=function(e,n){n in t.Pipeline.registeredFunctions&&t.utils.warn("Overwriting existing registered function: "+n),e.label=n,t.Pipeline.registeredFunctions[n]=e},t.Pipeline.getRegisteredFunction=function(e){return e in t.Pipeline.registeredFunctions!=!0?null:t.Pipeline.registeredFunctions[e]},t.Pipeline.warnIfFunctionNotRegistered=function(e){var n=e.label&&e.label in this.registeredFunctions;n||t.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},t.Pipeline.load=function(e){var n=new t.Pipeline;return e.forEach(function(e){var i=t.Pipeline.getRegisteredFunction(e);if(!i)throw new Error("Cannot load un-registered function: "+e);n.add(i)}),n},t.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){t.Pipeline.warnIfFunctionNotRegistered(e),this._queue.push(e)},this)},t.Pipeline.prototype.after=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i+1,0,n)},t.Pipeline.prototype.before=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i,0,n)},t.Pipeline.prototype.remove=function(e){var t=this._queue.indexOf(e);-1!==t&&this._queue.splice(t,1)},t.Pipeline.prototype.run=function(e){for(var t=[],n=e.length,i=this._queue.length,o=0;n>o;o++){for(var r=e[o],s=0;i>s&&(r=this._queue[s](r,o,e),void 0!==r&&null!==r);s++);void 0!==r&&null!==r&&t.push(r)}return t},t.Pipeline.prototype.reset=function(){this._queue=[]},t.Pipeline.prototype.get=function(){return this._queue},t.Pipeline.prototype.toJSON=function(){return this._queue.map(function(e){return t.Pipeline.warnIfFunctionNotRegistered(e),e.label})},t.Index=function(){this._fields=[],this._ref="id",this.pipeline=new t.Pipeline,this.documentStore=new t.DocumentStore,this.index={},this.eventEmitter=new t.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},t.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},t.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},t.Index.load=function(e){e.version!==t.version&&t.utils.warn("version mismatch: current "+t.version+" importing "+e.version);var n=new this;n._fields=e.fields,n._ref=e.ref,n.documentStore=t.DocumentStore.load(e.documentStore),n.pipeline=t.Pipeline.load(e.pipeline),n.index={};for(var i in e.index)n.index[i]=t.InvertedIndex.load(e.index[i]);return n},t.Index.prototype.addField=function(e){return this._fields.push(e),this.index[e]=new t.InvertedIndex,this},t.Index.prototype.setRef=function(e){return this._ref=e,this},t.Index.prototype.saveDocument=function(e){return this.documentStore=new t.DocumentStore(e),this},t.Index.prototype.addDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.addDoc(i,e),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));this.documentStore.addFieldLength(i,n,o.length);var r={};o.forEach(function(e){e in r?r[e]+=1:r[e]=1},this);for(var s in r){var u=r[s];u=Math.sqrt(u),this.index[n].addToken(s,{ref:i,tf:u})}},this),n&&this.eventEmitter.emit("add",e,this)}},t.Index.prototype.removeDocByRef=function(e){if(e&&this.documentStore.isDocStored()!==!1&&this.documentStore.hasDoc(e)){var t=this.documentStore.getDoc(e);this.removeDoc(t,!1)}},t.Index.prototype.removeDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.hasDoc(i)&&(this.documentStore.removeDoc(i),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));o.forEach(function(e){this.index[n].removeToken(e,i)},this)},this),n&&this.eventEmitter.emit("remove",e,this))}},t.Index.prototype.updateDoc=function(e,t){var t=void 0===t?!0:t;this.removeDocByRef(e[this._ref],!1),this.addDoc(e,!1),t&&this.eventEmitter.emit("update",e,this)},t.Index.prototype.idf=function(e,t){var n="@"+t+"/"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,n))return this._idfCache[n];var i=this.index[t].getDocFreq(e),o=1+Math.log(this.documentStore.length/(i+1));return this._idfCache[n]=o,o},t.Index.prototype.getFields=function(){return this._fields.slice()},t.Index.prototype.search=function(e,n){if(!e)return[];e="string"==typeof e?{any:e}:JSON.parse(JSON.stringify(e));var i=null;null!=n&&(i=JSON.stringify(n));for(var o=new t.Configuration(i,this.getFields()).get(),r={},s=Object.keys(e),u=0;u<s.length;u++){var a=s[u];r[a]=this.pipeline.run(t.tokenizer(e[a]))}var l={};for(var c in o){var d=r[c]||r.any;if(d){var f=this.fieldSearch(d,c,o),h=o[c].boost;for(var p in f)f[p]=f[p]*h;for(var p in f)p in l?l[p]+=f[p]:l[p]=f[p]}}var v,g=[];for(var p in l)v={ref:p,score:l[p]},this.documentStore.hasDoc(p)&&(v.doc=this.documentStore.getDoc(p)),g.push(v);return g.sort(function(e,t){return t.score-e.score}),g},t.Index.prototype.fieldSearch=function(e,t,n){var i=n[t].bool,o=n[t].expand,r=n[t].boost,s=null,u={};return 0!==r?(e.forEach(function(e){var n=[e];1==o&&(n=this.index[t].expandToken(e));var r={};n.forEach(function(n){var o=this.index[t].getDocs(n),a=this.idf(n,t);if(s&&"AND"==i){var l={};for(var c in s)c in o&&(l[c]=o[c]);o=l}n==e&&this.fieldSearchStats(u,n,o);for(var c in o){var d=this.index[t].getTermFrequency(n,c),f=this.documentStore.getFieldLength(c,t),h=1;0!=f&&(h=1/Math.sqrt(f));var p=1;n!=e&&(p=.15*(1-(n.length-e.length)/n.length));var v=d*a*h*p;c in r?r[c]+=v:r[c]=v}},this),s=this.mergeScores(s,r,i)},this),s=this.coordNorm(s,u,e.length)):void 0},t.Index.prototype.mergeScores=function(e,t,n){if(!e)return t;if("AND"==n){var i={};for(var o in t)o in e&&(i[o]=e[o]+t[o]);return i}for(var o in t)o in e?e[o]+=t[o]:e[o]=t[o];return e},t.Index.prototype.fieldSearchStats=function(e,t,n){for(var i in n)i in e?e[i].push(t):e[i]=[t]},t.Index.prototype.coordNorm=function(e,t,n){for(var i in e)if(i in t){var o=t[i].length;e[i]=e[i]*o/n}return e},t.Index.prototype.toJSON=function(){var e={};return this._fields.forEach(function(t){e[t]=this.index[t].toJSON()},this),{version:t.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),index:e,pipeline:this.pipeline.toJSON()}},t.Index.prototype.use=function(e){var t=Array.prototype.slice.call(arguments,1);t.unshift(this),e.apply(this,t)},t.DocumentStore=function(e){this._save=null===e||void 0===e?!0:e,this.docs={},this.docInfo={},this.length=0},t.DocumentStore.load=function(e){var t=new this;return t.length=e.length,t.docs=e.docs,t.docInfo=e.docInfo,t._save=e.save,t},t.DocumentStore.prototype.isDocStored=function(){return this._save},t.DocumentStore.prototype.addDoc=function(t,n){this.hasDoc(t)||this.length++,this.docs[t]=this._save===!0?e(n):null},t.DocumentStore.prototype.getDoc=function(e){return this.hasDoc(e)===!1?null:this.docs[e]},t.DocumentStore.prototype.hasDoc=function(e){return e in this.docs},t.DocumentStore.prototype.removeDoc=function(e){this.hasDoc(e)&&(delete this.docs[e],delete this.docInfo[e],this.length--)},t.DocumentStore.prototype.addFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&(this.docInfo[e]||(this.docInfo[e]={}),this.docInfo[e][t]=n)},t.DocumentStore.prototype.updateFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&this.addFieldLength(e,t,n)},t.DocumentStore.prototype.getFieldLength=function(e,t){return null===e||void 0===e?0:e in this.docs&&t in this.docInfo[e]?this.docInfo[e][t]:0},t.DocumentStore.prototype.toJSON=function(){return{docs:this.docs,docInfo:this.docInfo,length:this.length,save:this._save}},t.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",i="[aeiouy]",o=n+"[^aeiouy]*",r=i+"[aeiou]*",s="^("+o+")?"+r+o,u="^("+o+")?"+r+o+"("+r+")?$",a="^("+o+")?"+r+o+r+o,l="^("+o+")?"+i,c=new RegExp(s),d=new RegExp(a),f=new RegExp(u),h=new RegExp(l),p=/^(.+?)(ss|i)es$/,v=/^(.+?)([^s])s$/,g=/^(.+?)eed$/,m=/^(.+?)(ed|ing)$/,y=/.$/,S=/(at|bl|iz)$/,x=new RegExp("([^aeiouylsz])\\1$"),w=new RegExp("^"+o+i+"[^aeiouwxy]$"),I=/^(.+?[^aeiou])y$/,b=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,E=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,D=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,F=/^(.+?)(s|t)(ion)$/,_=/^(.+?)e$/,P=/ll$/,k=new RegExp("^"+o+i+"[^aeiouwxy]$"),z=function(n){var i,o,r,s,u,a,l;if(n.length<3)return n;if(r=n.substr(0,1),"y"==r&&(n=r.toUpperCase()+n.substr(1)),s=p,u=v,s.test(n)?n=n.replace(s,"$1$2"):u.test(n)&&(n=n.replace(u,"$1$2")),s=g,u=m,s.test(n)){var z=s.exec(n);s=c,s.test(z[1])&&(s=y,n=n.replace(s,""))}else if(u.test(n)){var z=u.exec(n);i=z[1],u=h,u.test(i)&&(n=i,u=S,a=x,l=w,u.test(n)?n+="e":a.test(n)?(s=y,n=n.replace(s,"")):l.test(n)&&(n+="e"))}if(s=I,s.test(n)){var z=s.exec(n);i=z[1],n=i+"i"}if(s=b,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=c,s.test(i)&&(n=i+e[o])}if(s=E,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=c,s.test(i)&&(n=i+t[o])}if(s=D,u=F,s.test(n)){var z=s.exec(n);i=z[1],s=d,s.test(i)&&(n=i)}else if(u.test(n)){var z=u.exec(n);i=z[1]+z[2],u=d,u.test(i)&&(n=i)}if(s=_,s.test(n)){var z=s.exec(n);i=z[1],s=d,u=f,a=k,(s.test(i)||u.test(i)&&!a.test(i))&&(n=i)}return s=P,u=d,s.test(n)&&u.test(n)&&(s=y,n=n.replace(s,"")),"y"==r&&(n=r.toLowerCase()+n.substr(1)),n};return z}(),t.Pipeline.registerFunction(t.stemmer,"stemmer"),t.stopWordFilter=function(e){return e&&t.stopWordFilter.stopWords[e]!==!0?e:void 0},t.clearStopWords=function(){t.stopWordFilter.stopWords={}},t.addStopWords=function(e){null!=e&&Array.isArray(e)!==!1&&e.forEach(function(e){t.stopWordFilter.stopWords[e]=!0},this)},t.resetStopWords=function(){t.stopWordFilter.stopWords=t.defaultStopWords},t.defaultStopWords={"":!0,a:!0,able:!0,about:!0,across:!0,after:!0,all:!0,almost:!0,also:!0,am:!0,among:!0,an:!0,and:!0,any:!0,are:!0,as:!0,at:!0,be:!0,because:!0,been:!0,but:!0,by:!0,can:!0,cannot:!0,could:!0,dear:!0,did:!0,"do":!0,does:!0,either:!0,"else":!0,ever:!0,every:!0,"for":!0,from:!0,get:!0,got:!0,had:!0,has:!0,have:!0,he:!0,her:!0,hers:!0,him:!0,his:!0,how:!0,however:!0,i:!0,"if":!0,"in":!0,into:!0,is:!0,it:!0,its:!0,just:!0,least:!0,let:!0,like:!0,likely:!0,may:!0,me:!0,might:!0,most:!0,must:!0,my:!0,neither:!0,no:!0,nor:!0,not:!0,of:!0,off:!0,often:!0,on:!0,only:!0,or:!0,other:!0,our:!0,own:!0,rather:!0,said:!0,say:!0,says:!0,she:!0,should:!0,since:!0,so:!0,some:!0,than:!0,that:!0,the:!0,their:!0,them:!0,then:!0,there:!0,these:!0,they:!0,"this":!0,tis:!0,to:!0,too:!0,twas:!0,us:!0,wants:!0,was:!0,we:!0,were:!0,what:!0,when:!0,where:!0,which:!0,"while":!0,who:!0,whom:!0,why:!0,will:!0,"with":!0,would:!0,yet:!0,you:!0,your:!0},t.stopWordFilter.stopWords=t.defaultStopWords,t.Pipeline.registerFunction(t.stopWordFilter,"stopWordFilter"),t.trimmer=function(e){if(null===e||void 0===e)throw new Error("token should not be undefined");return e.replace(/^\W+/,"").replace(/\W+$/,"")},t.Pipeline.registerFunction(t.trimmer,"trimmer"),t.InvertedIndex=function(){this.root={docs:{},df:0}},t.InvertedIndex.load=function(e){var t=new this;return t.root=e.root,t},t.InvertedIndex.prototype.addToken=function(e,t,n){for(var n=n||this.root,i=0;i<=e.length-1;){var o=e[i];o in n||(n[o]={docs:{},df:0}),i+=1,n=n[o]}var r=t.ref;n.docs[r]?n.docs[r]={tf:t.tf}:(n.docs[r]={tf:t.tf},n.df+=1)},t.InvertedIndex.prototype.hasToken=function(e){if(!e)return!1;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return!1;t=t[e[n]]}return!0},t.InvertedIndex.prototype.getNode=function(e){if(!e)return null;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return null;t=t[e[n]]}return t},t.InvertedIndex.prototype.getDocs=function(e){var t=this.getNode(e);return null==t?{}:t.docs},t.InvertedIndex.prototype.getTermFrequency=function(e,t){var n=this.getNode(e);return null==n?0:t in n.docs?n.docs[t].tf:0},t.InvertedIndex.prototype.getDocFreq=function(e){var t=this.getNode(e);return null==t?0:t.df},t.InvertedIndex.prototype.removeToken=function(e,t){if(e){var n=this.getNode(e);null!=n&&t in n.docs&&(delete n.docs[t],n.df-=1)}},t.InvertedIndex.prototype.expandToken=function(e,t,n){if(null==e||""==e)return[];var t=t||[];if(void 0==n&&(n=this.getNode(e),null==n))return t;n.df>0&&t.push(e);for(var i in n)"docs"!==i&&"df"!==i&&this.expandToken(e+i,t,n[i]);return t},t.InvertedIndex.prototype.toJSON=function(){return{root:this.root}},t.Configuration=function(e,n){var e=e||"";if(void 0==n||null==n)throw new Error("fields should not be null");this.config={};var i;try{i=JSON.parse(e),this.buildUserConfig(i,n)}catch(o){t.utils.warn("user configuration parse failed, will use default configuration"),this.buildDefaultConfig(n)}},t.Configuration.prototype.buildDefaultConfig=function(e){this.reset(),e.forEach(function(e){this.config[e]={boost:1,bool:"OR",expand:!1}},this)},t.Configuration.prototype.buildUserConfig=function(e,n){var i="OR",o=!1;if(this.reset(),"bool"in e&&(i=e.bool||i),"expand"in e&&(o=e.expand||o),"fields"in e)for(var r in e.fields)if(n.indexOf(r)>-1){var s=e.fields[r],u=o;void 0!=s.expand&&(u=s.expand),this.config[r]={boost:s.boost||0===s.boost?s.boost:1,bool:s.bool||i,expand:u}}else t.utils.warn("field name in user configuration not found in index instance fields");else this.addAllFields2UserConfig(i,o,n)},t.Configuration.prototype.addAllFields2UserConfig=function(e,t,n){n.forEach(function(n){this.config[n]={boost:1,bool:e,expand:t}},this)},t.Configuration.prototype.get=function(){return this.config},t.Configuration.prototype.reset=function(){this.config={}},lunr.SortedSet=function(){this.length=0,this.elements=[]},lunr.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},lunr.SortedSet.prototype.add=function(){var e,t;for(e=0;e<arguments.length;e++)t=arguments[e],~this.indexOf(t)||this.elements.splice(this.locationFor(t),0,t);this.length=this.elements.length},lunr.SortedSet.prototype.toArray=function(){return this.elements.slice()},lunr.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},lunr.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},lunr.SortedSet.prototype.indexOf=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;){if(r===e)return o;e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o]}return r===e?o:-1},lunr.SortedSet.prototype.locationFor=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;)e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o];return r>e?o:e>r?o+1:void 0},lunr.SortedSet.prototype.intersect=function(e){for(var t=new lunr.SortedSet,n=0,i=0,o=this.length,r=e.length,s=this.elements,u=e.elements;;){if(n>o-1||i>r-1)break;s[n]!==u[i]?s[n]<u[i]?n++:s[n]>u[i]&&i++:(t.add(s[n]),n++,i++)}return t},lunr.SortedSet.prototype.clone=function(){var e=new lunr.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},lunr.SortedSet.prototype.union=function(e){var t,n,i;this.length>=e.length?(t=this,n=e):(t=e,n=this),i=t.clone();for(var o=0,r=n.toArray();o<r.length;o++)i.add(r[o]);return i},lunr.SortedSet.prototype.toJSON=function(){return this.toArray()},function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.elasticlunr=t()}(this,function(){return t})}();
    /** pdoc search index */const docs = [{"fullname": "musicdiff", "modulename": "musicdiff", "type": "module", "doc": "<p></p>\n"}, {"fullname": "musicdiff.diff", "modulename": "musicdiff", "qualname": "diff", "type": "function", "doc": "<p>Compare two musical scores and optionally save/display the differences as two marked-up\nrendered PDFs.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>score1 (str, Path, music21.stream.Score):</strong>  The first music score to compare. The score\ncan be a file of any format readable by music21 (e.g. MusicXML, MEI, Humdrum, MIDI,\netc), or a music21 Score object.</li>\n<li><strong>score2 (str, Path, music21.stream.Score):</strong>  The second musical score to compare. The score\ncan be a file of any format readable by music21 (e.g. MusicXML, MEI, Humdrum, MIDI,\netc), or a music21 Score object.</li>\n<li><strong>out_path1 (str, Path):</strong>  Where to save the first marked-up rendered score PDF.\nIf out_path1 is None, both PDFs will be displayed in the default PDF viewer.\n(default is None)</li>\n<li><strong>out_path2 (str, Path):</strong>  Where to save the second marked-up rendered score PDF.\nIf out_path2 is None, both PDFs will be displayed in the default PDF viewer.\n(default is None)</li>\n<li><strong>force_parse (bool):</strong>  Whether or not to force music21 to re-parse a file it has parsed\npreviously.\n(default is True)</li>\n<li><strong>visualize_diffs (bool):</strong>  Whether or not to render diffs as marked up PDFs. If False,\nthe only result of the call will be the return value (the number of differences).\n(default is True)</li>\n<li><strong>detail (DetailLevel):</strong>  What level of detail to use during the diff.  Can be\nGeneralNotesOnly, AllObjects, AllObjectsWithStyle or Default (Default is\ncurrently equivalent to AllObjects).</li>\n</ul>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>int: The number of differences found (0 means the scores were identical, None means the diff failed)</p>\n</blockquote>\n", "signature": "(\n    score1: Union[str, pathlib.Path, music21.stream.base.Score],\n    score2: Union[str, pathlib.Path, music21.stream.base.Score],\n    out_path1: Union[str, pathlib.Path] = None,\n    out_path2: Union[str, pathlib.Path] = None,\n    force_parse: bool = True,\n    visualize_diffs: bool = True,\n    detail: musicdiff.m21utils.DetailLevel = <DetailLevel.AllObjects: 2>\n) -> int", "funcdef": "def"}, {"fullname": "musicdiff.annotation", "modulename": "musicdiff.annotation", "type": "module", "doc": "<p></p>\n"}, {"fullname": "musicdiff.annotation.AnnNote", "modulename": "musicdiff.annotation", "qualname": "AnnNote", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.annotation.AnnNote.__init__", "modulename": "musicdiff.annotation", "qualname": "AnnNote.__init__", "type": "function", "doc": "<p>Extend music21 GeneralNote with some precomputed, easily compared information about it.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>general_note (music21.note.GeneralNote):</strong>  The music21 note/chord/rest to extend.</li>\n<li><strong>enhanced_beam_list (list):</strong>  A list of beaming information about this GeneralNote.</li>\n<li><strong>tuplet_list (list):</strong>  A list of tuplet info about this GeneralNote.</li>\n<li><strong>detail (DetailLevel):</strong>  What level of detail to use during the diff.  Can be\nGeneralNotesOnly, AllObjects, AllObjectsWithStyle or Default (Default is\ncurrently equivalent to AllObjects).</li>\n</ul>\n", "signature": "(\n    self,\n    general_note: music21.note.GeneralNote,\n    enhanced_beam_list,\n    tuplet_list,\n    detail: musicdiff.m21utils.DetailLevel = <DetailLevel.AllObjects: 2>\n)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnNote.notation_size", "modulename": "musicdiff.annotation", "qualname": "AnnNote.notation_size", "type": "function", "doc": "<p>Compute a measure of how many symbols are displayed in the score for this <code>AnnNote</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>int: The notation size of the annotated note</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnNote.get_note_ids", "modulename": "musicdiff.annotation", "qualname": "AnnNote.get_note_ids", "type": "function", "doc": "<p>Computes a list of the GeneralNote ids for this <code>AnnNote</code>.  Since there\nis only one GeneralNote here, this will always be a single-element list.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>[int]: A list containing the single GeneralNote id for this note.</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnExtra", "modulename": "musicdiff.annotation", "qualname": "AnnExtra", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.annotation.AnnExtra.__init__", "modulename": "musicdiff.annotation", "qualname": "AnnExtra.__init__", "type": "function", "doc": "<p>Extend music21 non-GeneralNote and non-Stream objects with some precomputed, easily compared information about it.\nExamples: TextExpression, Dynamic, Clef, Key, TimeSignature, MetronomeMark, etc.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>extra (music21.base.Music21Object):</strong>  The music21 non-GeneralNote/non-Stream object to extend.</li>\n<li><strong>measure (music21.stream.Measure):</strong>  The music21 Measure the extra was found in.  If the extra\nwas found in a Voice, this is the Measure that the Voice was found in.</li>\n<li><strong>detail (DetailLevel):</strong>  What level of detail to use during the diff.  Can be\nGeneralNotesOnly, AllObjects, AllObjectsWithStyle or Default (Default is\ncurrently equivalent to AllObjects).</li>\n</ul>\n", "signature": "(\n    self,\n    extra: music21.base.Music21Object,\n    measure: music21.stream.base.Measure,\n    score: music21.stream.base.Score,\n    detail: musicdiff.m21utils.DetailLevel = <DetailLevel.AllObjects: 2>\n)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnExtra.notation_size", "modulename": "musicdiff.annotation", "qualname": "AnnExtra.notation_size", "type": "function", "doc": "<p>Compute a measure of how many symbols are displayed in the score for this <code>AnnExtra</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>int: The notation size of the annotated extra</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnVoice", "modulename": "musicdiff.annotation", "qualname": "AnnVoice", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.annotation.AnnVoice.__init__", "modulename": "musicdiff.annotation", "qualname": "AnnVoice.__init__", "type": "function", "doc": "<p>Extend music21 Voice with some precomputed, easily compared information about it.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>voice (music21.stream.Voice):</strong>  The music21 voice to extend.</li>\n<li><strong>detail (DetailLevel):</strong>  What level of detail to use during the diff.  Can be\nGeneralNotesOnly, AllObjects, AllObjectsWithStyle or Default (Default is\ncurrently equivalent to AllObjects).</li>\n</ul>\n", "signature": "(\n    self,\n    voice: music21.stream.base.Voice,\n    detail: musicdiff.m21utils.DetailLevel = <DetailLevel.AllObjects: 2>\n)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnVoice.notation_size", "modulename": "musicdiff.annotation", "qualname": "AnnVoice.notation_size", "type": "function", "doc": "<p>Compute a measure of how many symbols are displayed in the score for this <code>AnnVoice</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>int: The notation size of the annotated voice</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnVoice.get_note_ids", "modulename": "musicdiff.annotation", "qualname": "AnnVoice.get_note_ids", "type": "function", "doc": "<p>Computes a list of the GeneralNote ids for this <code>AnnVoice</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>[int]: A list containing the GeneralNote ids contained in this voice</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnMeasure", "modulename": "musicdiff.annotation", "qualname": "AnnMeasure", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.annotation.AnnMeasure.__init__", "modulename": "musicdiff.annotation", "qualname": "AnnMeasure.__init__", "type": "function", "doc": "<p>Extend music21 Measure with some precomputed, easily compared information about it.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>measure (music21.stream.Measure):</strong>  The music21 measure to extend.</li>\n<li><strong>score (music21.stream.Score):</strong>  the enclosing music21 Score.</li>\n<li><strong>spannerBundle (music21.spanner.SpannerBundle):</strong>  a bundle of all the spanners in the score.</li>\n<li><strong>detail (DetailLevel):</strong>  What level of detail to use during the diff.  Can be\nGeneralNotesOnly, AllObjects, AllObjectsWithStyle or Default (Default is\ncurrently equivalent to AllObjects).</li>\n</ul>\n", "signature": "(\n    self,\n    measure: music21.stream.base.Measure,\n    score: music21.stream.base.Score,\n    spannerBundle: music21.spanner.SpannerBundle,\n    detail: musicdiff.m21utils.DetailLevel = <DetailLevel.AllObjects: 2>\n)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnMeasure.notation_size", "modulename": "musicdiff.annotation", "qualname": "AnnMeasure.notation_size", "type": "function", "doc": "<p>Compute a measure of how many symbols are displayed in the score for this <code>AnnMeasure</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>int: The notation size of the annotated measure</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnMeasure.get_note_ids", "modulename": "musicdiff.annotation", "qualname": "AnnMeasure.get_note_ids", "type": "function", "doc": "<p>Computes a list of the GeneralNote ids for this <code>AnnMeasure</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>[int]: A list containing the GeneralNote ids contained in this measure</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnPart", "modulename": "musicdiff.annotation", "qualname": "AnnPart", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.annotation.AnnPart.__init__", "modulename": "musicdiff.annotation", "qualname": "AnnPart.__init__", "type": "function", "doc": "<p>Extend music21 Part/PartStaff with some precomputed, easily compared information about it.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>part (music21.stream.Part, music21.stream.PartStaff):</strong>  The music21 Part/PartStaff to extend.</li>\n<li><strong>score (music21.stream.Score):</strong>  the enclosing music21 Score.</li>\n<li><strong>spannerBundle (music21.spanner.SpannerBundle):</strong>  a bundle of all the spanners in the score.</li>\n<li><strong>detail (DetailLevel):</strong>  What level of detail to use during the diff.  Can be\nGeneralNotesOnly, AllObjects, AllObjectsWithStyle or Default (Default is\ncurrently equivalent to AllObjects).</li>\n</ul>\n", "signature": "(\n    self,\n    part: music21.stream.base.Part,\n    score: music21.stream.base.Score,\n    spannerBundle: music21.spanner.SpannerBundle,\n    detail: musicdiff.m21utils.DetailLevel = <DetailLevel.AllObjects: 2>\n)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnPart.notation_size", "modulename": "musicdiff.annotation", "qualname": "AnnPart.notation_size", "type": "function", "doc": "<p>Compute a measure of how many symbols are displayed in the score for this <code>AnnPart</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>int: The notation size of the annotated part</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnPart.get_note_ids", "modulename": "musicdiff.annotation", "qualname": "AnnPart.get_note_ids", "type": "function", "doc": "<p>Computes a list of the GeneralNote ids for this <code>AnnPart</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>[int]: A list containing the GeneralNote ids contained in this part</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnScore", "modulename": "musicdiff.annotation", "qualname": "AnnScore", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.annotation.AnnScore.__init__", "modulename": "musicdiff.annotation", "qualname": "AnnScore.__init__", "type": "function", "doc": "<p>Take a music21 score and store it as a sequence of Full Trees.\nThe hierarchy is \"score -> parts -> measures -> voices -> notes\"</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>score (music21.stream.Score):</strong>  The music21 score</li>\n<li><strong>detail (DetailLevel):</strong>  What level of detail to use during the diff.  Can be\nGeneralNotesOnly, AllObjects, AllObjectsWithStyle or Default (Default is\ncurrently equivalent to AllObjects).</li>\n</ul>\n", "signature": "(\n    self,\n    score: music21.stream.base.Score,\n    detail: musicdiff.m21utils.DetailLevel = <DetailLevel.AllObjects: 2>\n)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnScore.notation_size", "modulename": "musicdiff.annotation", "qualname": "AnnScore.notation_size", "type": "function", "doc": "<p>Compute a measure of how many symbols are displayed in the score for this <code>AnnScore</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>int: The notation size of the annotated score</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.annotation.AnnScore.get_note_ids", "modulename": "musicdiff.annotation", "qualname": "AnnScore.get_note_ids", "type": "function", "doc": "<p>Computes a list of the GeneralNote ids for this <code>AnnScore</code>.</p>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>[int]: A list containing the GeneralNote ids contained in this score</p>\n</blockquote>\n", "signature": "(self)", "funcdef": "def"}, {"fullname": "musicdiff.comparison", "modulename": "musicdiff.comparison", "type": "module", "doc": "<p></p>\n"}, {"fullname": "musicdiff.comparison.Comparison", "modulename": "musicdiff.comparison", "qualname": "Comparison", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.comparison.Comparison.__init__", "modulename": "musicdiff.comparison", "qualname": "Comparison.__init__", "type": "function", "doc": "<p></p>\n", "signature": "()", "funcdef": "def"}, {"fullname": "musicdiff.comparison.Comparison.annotated_scores_diff", "modulename": "musicdiff.comparison", "qualname": "Comparison.annotated_scores_diff", "type": "function", "doc": "<p>Compare two annotated scores, computing an operations list and the cost of applying those\noperations to the first score to generate the second score.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>score1 (<code>musicdiff.annotation.AnnScore</code>):</strong>  The first annotated score to compare.</li>\n<li><strong>score2 (<code>musicdiff.annotation.AnnScore</code>):</strong>  The second annotated score to compare.</li>\n</ul>\n\n<h6 id=\"returns\">Returns</h6>\n\n<blockquote>\n  <p>List[Tuple], int: The operations list and the cost</p>\n</blockquote>\n", "signature": "(\n    score1: musicdiff.annotation.AnnScore,\n    score2: musicdiff.annotation.AnnScore\n) -> Tuple[List[Tuple], int]", "funcdef": "def"}, {"fullname": "musicdiff.visualization", "modulename": "musicdiff.visualization", "type": "module", "doc": "<p></p>\n"}, {"fullname": "musicdiff.visualization.Visualization", "modulename": "musicdiff.visualization", "qualname": "Visualization", "type": "class", "doc": "<p></p>\n"}, {"fullname": "musicdiff.visualization.Visualization.__init__", "modulename": "musicdiff.visualization", "qualname": "Visualization.__init__", "type": "function", "doc": "<p></p>\n", "signature": "()", "funcdef": "def"}, {"fullname": "musicdiff.visualization.Visualization.INSERTED_COLOR", "modulename": "musicdiff.visualization", "qualname": "Visualization.INSERTED_COLOR", "type": "variable", "doc": "<p><code>INSERTED_COLOR</code> can be set to customize the rendered score markup that <code>mark_diffs</code> does.</p>\n", "default_value": " = 'red'"}, {"fullname": "musicdiff.visualization.Visualization.DELETED_COLOR", "modulename": "musicdiff.visualization", "qualname": "Visualization.DELETED_COLOR", "type": "variable", "doc": "<p><code>DELETED_COLOR</code> can be set to customize the rendered score markup that <code>mark_diffs</code> does.</p>\n", "default_value": " = 'red'"}, {"fullname": "musicdiff.visualization.Visualization.CHANGED_COLOR", "modulename": "musicdiff.visualization", "qualname": "Visualization.CHANGED_COLOR", "type": "variable", "doc": "<p><code>CHANGED_COLOR</code> can be set to customize the rendered score markup that <code>mark_diffs</code> does.</p>\n", "default_value": " = 'red'"}, {"fullname": "musicdiff.visualization.Visualization.mark_diffs", "modulename": "musicdiff.visualization", "qualname": "Visualization.mark_diffs", "type": "function", "doc": "<p>Mark up two music21 scores with the differences described by an operations\nlist (e.g. a list returned from <code>musicdiff.Comparison.annotated_scores_diff</code>).</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>score1 (music21.stream.Score):</strong>  The first score to mark up</li>\n<li><strong>score2 (music21.stream.Score):</strong>  The second score to mark up</li>\n<li><strong>operations (List[Tuple]):</strong>  The operations list that describes the difference\nbetween the two scores</li>\n</ul>\n", "signature": "(\n    score1: music21.stream.base.Score,\n    score2: music21.stream.base.Score,\n    operations: List[Tuple]\n)", "funcdef": "def"}, {"fullname": "musicdiff.visualization.Visualization.show_diffs", "modulename": "musicdiff.visualization", "qualname": "Visualization.show_diffs", "type": "function", "doc": "<p>Render two (presumably marked-up) music21 scores.  If both out_path1 and out_path2 are not None,\nsave the rendered PDFs at those two locations, otherwise just display them using the default\nPDF viewer on the system.</p>\n\n<h6 id=\"args\">Args</h6>\n\n<ul>\n<li><strong>score1 (music21.stream.Score):</strong>  The first score to render</li>\n<li><strong>score2 (music21.stream.Score):</strong>  The second score to render</li>\n<li><strong>out_path1 (str, Path):</strong>  Where to save the first marked-up rendered score PDF.\nIf out_path1 is None, both PDFs will be displayed in the default PDF viewer.\n(default is None)</li>\n<li><strong>out_path2 (str, Path):</strong>  Where to save the second marked-up rendered score PDF.\nIf out_path2 is None, both PDFs will be displayed in the default PDF viewer.\n(default is None)</li>\n</ul>\n", "signature": "(\n    score1: music21.stream.base.Score,\n    score2: music21.stream.base.Score,\n    out_path1: Union[str, pathlib.Path] = None,\n    out_path2: Union[str, pathlib.Path] = None\n)", "funcdef": "def"}];

    // mirrored in build-search-index.js (part 1)
    // Also split on html tags. this is a cheap heuristic, but good enough.
    elasticlunr.tokenizer.setSeperator(/[\s\-.;&_'"=,()]+|<[^>]*>/);

    let searchIndex;
    if (docs._isPrebuiltIndex) {
        console.info("using precompiled search index");
        searchIndex = elasticlunr.Index.load(docs);
    } else {
        console.time("building search index");
        // mirrored in build-search-index.js (part 2)
        searchIndex = elasticlunr(function () {
            this.pipeline.remove(elasticlunr.stemmer);
            this.pipeline.remove(elasticlunr.stopWordFilter);
            this.addField("qualname");
            this.addField("fullname");
            this.addField("annotation");
            this.addField("default_value");
            this.addField("signature");
            this.addField("bases");
            this.addField("doc");
            this.setRef("fullname");
        });
        for (let doc of docs) {
            searchIndex.addDoc(doc);
        }
        console.timeEnd("building search index");
    }

    return (term) => searchIndex.search(term, {
        fields: {
            qualname: {boost: 4},
            fullname: {boost: 2},
            annotation: {boost: 2},
            default_value: {boost: 2},
            signature: {boost: 2},
            bases: {boost: 2},
            doc: {boost: 1},
        },
        expand: true
    });
})();