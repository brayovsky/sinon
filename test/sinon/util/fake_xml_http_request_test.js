/*jslint indent: 2, onevar: false*/
/*globals testCase,
          sinon,
          assert,
          assertSame,
          assertEquals,
          assertTrue,
          assertFalse,
          assertNull,
          assertException,
          assertUndefined,
          assertObject,
          assertFunction*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
(function (global) {
  testCase("FakeXMLHttpRequestTest", {
    tearDown: function () {
      delete sinon.FakeXMLHttpRequest.onCreate;
    },

    "should be constructor": function () {
      assertFunction(sinon.FakeXMLHttpRequest);
      assertSame(sinon.FakeXMLHttpRequest, sinon.FakeXMLHttpRequest.prototype.constructor);
    },

    "should implement status constants": function () {
      assertSame(1, sinon.FakeXMLHttpRequest.OPENED);
      assertSame(2, sinon.FakeXMLHttpRequest.HEADERS_RECEIVED);
      assertSame(3, sinon.FakeXMLHttpRequest.LOADING);
      assertSame(4, sinon.FakeXMLHttpRequest.DONE);
    },

    "should call onCreate if listener is set": function () {
      var onCreate = sinon.spy();
      sinon.FakeXMLHttpRequest.onCreate = onCreate;

      var xhr = new sinon.FakeXMLHttpRequest();

      assert(onCreate.called);
    },

    "should pass new object to onCreate if set": function () {
      var onCreate = sinon.spy();
      sinon.FakeXMLHttpRequest.onCreate = onCreate;

      var xhr = new sinon.FakeXMLHttpRequest();

      assertSame(xhr, onCreate.getCall(0).args[0]);
    }
  });

  testCase("FakeXMLHttpRequestOpenTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
    },

    "should be method": function () {
      assertFunction(this.xhr.open);
    },

    "should set properties on object": function () {
      this.xhr.open("GET", "/my/url", true, "cjno", "pass");

      assertEquals("GET", this.xhr.method);
      assertEquals("/my/url", this.xhr.url);
      assertTrue(this.xhr.async);
      assertEquals("cjno", this.xhr.username);
      assertEquals("pass", this.xhr.password);
    },

    "should be async by default": function () {
      this.xhr.open("GET", "/my/url");

      assertTrue(this.xhr.async);
    },

    "should set async to false": function () {
      this.xhr.open("GET", "/my/url", false);

      assertFalse(this.xhr.async);
    },

    "should set responseText to null": function () {
      this.xhr.open("GET", "/my/url");

      assertNull(this.xhr.responseText);
    },

    "should set requestHeaders to blank object": function () {
      this.xhr.open("GET", "/my/url");

      assertObject(this.xhr.requestHeaders);
      assertEquals({}, this.xhr.requestHeaders);
    },

    "should set readyState to OPENED": function () {
      this.xhr.open("GET", "/my/url");

      assertSame(sinon.FakeXMLHttpRequest.OPENED, this.xhr.readyState);
    },

    "should set send flag to false": function () {
      this.xhr.open("GET", "/my/url");

      assertFalse(this.xhr.sendFlag);
    },

    "should dispatch onreadystatechange with reset state": function () {
      var state = {};

      this.xhr.onreadystatechange = function () {
        sinon.extend(state, this);
      };

      this.xhr.open("GET", "/my/url");

      assertEquals("GET", state.method);
      assertEquals("/my/url", state.url);
      assertTrue(state.async);
      assertUndefined(state.username);
      assertUndefined(state.password);
      assertNull(state.responseText);
      assertEquals({}, state.responseHeaders);
      assertEquals(sinon.FakeXMLHttpRequest.OPENED, state.readyState);
      assertFalse(state.sendFlag);
    }
  });

  testCase("setRequestHeader", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
    },

    "should throw exception if readyState is not OPENED": function () {
      var xhr = new sinon.FakeXMLHttpRequest();

      assertException(function () {
        xhr.setRequestHeader("X-EY", "No-no");
      });
    },

    "should throw exception if send flag is true": function () {
      var xhr = this.xhr;
      xhr.sendFlag = true;

      assertException(function () {
        xhr.setRequestHeader("X-EY", "No-no");
      });
    },

    "should disallow unsafe headers": function () {
      var xhr = this.xhr;

      assertException(function () {
        xhr.setRequestHeader("Accept-Charset", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Accept-Encoding", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Connection", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Content-Length", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Cookie", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Cookie2", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Content-Transfer-Encoding", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Date", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Expect", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Host", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Keep-Alive", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Referer", "");
      });

      assertException(function () {
        xhr.setRequestHeader("TE", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Trailer", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Transfer-Encoding", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Upgrade", "");
      });

      assertException(function () {
        xhr.setRequestHeader("User-Agent", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Via", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Proxy-Oops", "");
      });

      assertException(function () {
        xhr.setRequestHeader("Sec-Oops", "");
      });
    },

    "should set header and value": function () {
      this.xhr.setRequestHeader("X-Fake", "Yeah!");

      assertEquals({ "X-Fake": "Yeah!" }, this.xhr.requestHeaders);
    },

    "should append same-named header values": function () {
      this.xhr.setRequestHeader("X-Fake", "Oh");
      this.xhr.setRequestHeader("X-Fake", "yeah!");

      assertEquals({ "X-Fake": "Oh,yeah!" }, this.xhr.requestHeaders);
    }
  });

  testCase("FakeXMLHttpRequestSendTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
    },

    "should throw if request is not open": function () {
      var xhr = new sinon.FakeXMLHttpRequest();

      assertException(function () {
        xhr.send();
      });
    },

    "should throw if send flag is true": function () {
      var xhr = this.xhr;
      xhr.open("GET", "/");
      xhr.sendFlag = true;

      assertException(function () {
        xhr.send();
      });
    },

    "should set GET body to null": function () {
      this.xhr.open("GET", "/");
      this.xhr.send("Data");

      assertNull(this.xhr.requestBody);
    },

    "should set HEAD body to null": function () {
      this.xhr.open("HEAD", "/");
      this.xhr.send("Data");

      assertNull(this.xhr.requestBody);
    },

    "should set mime to text/plain": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertEquals("text/plain;charset=utf-8", this.xhr.requestHeaders["Content-Type"]);
    },

    "should not override mime": function () {
      this.xhr.open("POST", "/");
      this.xhr.setRequestHeader("Content-Type", "text/html");
      this.xhr.send("Data");

      assertEquals("text/html;charset=utf-8", this.xhr.requestHeaders["Content-Type"]);
    },

    "should set request body to string data": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertEquals("Data", this.xhr.requestBody);
    },

    "should set error flag to false": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertFalse(this.xhr.errorFlag);
    },

    "should set send flag to true": function () {
      this.xhr.open("POST", "/");
      this.xhr.send("Data");

      assertTrue(this.xhr.sendFlag);
    },

    "should not set send flag to true if sync": function () {
      this.xhr.open("POST", "/", false);
      this.xhr.send("Data");

      assertFalse(this.xhr.sendFlag);
    },

    "should dispatch onreadystatechange": function () {
      var state;
      this.xhr.open("POST", "/", false);

      this.xhr.onreadystatechange = function () {
        state = this.readyState;
      };

      this.xhr.send("Data");

      assertEquals(sinon.FakeXMLHttpRequest.OPENED, state);
    },

    "should dispatch onSend callback if set": function () {
      this.xhr.open("POST", "/", true);
      var callback = sinon.spy();
      this.xhr.onSend = callback;

      this.xhr.send("Data");

      assert(callback.called);
    },

    "should dispatch onSend with request as argument": function () {
      this.xhr.open("POST", "/", true);
      var callback = sinon.spy();
      this.xhr.onSend = callback;

      this.xhr.send("Data");

      assert(callback.calledWith(this.xhr));
    },

    "should dispatch onSend when async": function () {
      this.xhr.open("POST", "/", false);
      var callback = sinon.spy();
      this.xhr.onSend = callback;

      this.xhr.send("Data");

      assert(callback.calledWith(this.xhr));
    }
  });

  testCase("FakeXMLHttpRequestSetResponseHeadersTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
    },

    "should set request headers": function () {
      var object = { id: 42 };
      this.xhr.open("GET", "/");
      this.xhr.send();
      this.xhr.setResponseHeaders(object);

      assertSame(object, this.xhr.responseHeaders);
    },

    "should call readyStateChange with HEADERS_RECEIVED": function () {
      var object = { id: 42 };
      this.xhr.open("GET", "/");
      this.xhr.send();
      var spy = this.xhr.readyStateChange = sinon.spy();

      this.xhr.setResponseHeaders(object);

      assert(spy.calledWith(sinon.FakeXMLHttpRequest.HEADERS_RECEIVED));
    },

    "should not call readyStateChange if sync": function () {
      var object = { id: 42 };
      this.xhr.open("GET", "/", false);
      this.xhr.send();
      var spy = this.xhr.readyStateChange = sinon.spy();

      this.xhr.setResponseHeaders(object);

      assertFalse(spy.called);
    }
  });

  testCase("FakeXMLHttpRequestSetResponseBodyAsyncTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
      this.xhr.send();
      this.xhr.setResponseHeaders({});
    },

    "should invoke onreadystatechange handler with LOADING state": function () {
      var spy = sinon.spy();
      this.xhr.readyStateChange = spy;

      this.xhr.setResponseBody("Some text goes in here ok?");

      assert(spy.calledWith(sinon.FakeXMLHttpRequest.LOADING));
    },

    "should invoke onreadystatechange handler for each 10 byte chunk": function () {
      var spy = sinon.spy();
      this.xhr.readyStateChange = spy;
      this.xhr.chunkSize = 10;

      this.xhr.setResponseBody("Some text goes in here ok?");

      assertEquals(4, spy.callCount);
    },

    "should invoke onreadystatechange handler for each x byte chunk": function () {
      var spy = sinon.spy();
      this.xhr.readyStateChange = spy;
      this.xhr.chunkSize = 20;

      this.xhr.setResponseBody("Some text goes in here ok?");

      assertEquals(3, spy.callCount);
    },

    "should invoke onreadystatechange handler with partial data": function () {
      var pieces = [];
      var spy = sinon.spy(function () { pieces.push(this.responseText); });
      this.xhr.readyStateChange = spy;
      this.xhr.chunkSize = 9;

      this.xhr.setResponseBody("Some text goes in here ok?");

      assertEquals("Some text", pieces[1]);
    },

    "should call onreadystatechange with DONE state": function () {
      var spy = sinon.spy();
      this.xhr.readyStateChange = spy;

      this.xhr.setResponseBody("Some text goes in here ok?");

      assert(spy.calledWith(sinon.FakeXMLHttpRequest.DONE));
    },

    "should throw if not open": function () {
      var xhr = new sinon.FakeXMLHttpRequest();

      assertException(function () {
        xhr.setResponseBody("");
      });
    },

    "should throw if no headers received": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/");
      xhr.send();

      assertException(function () {
        xhr.setResponseBody("");
      });
    },

    "should throw if body was already sent": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/");
      xhr.send();
      xhr.setResponseHeaders({});
      xhr.setResponseBody("");

      assertException(function () {
        xhr.setResponseBody("");
      });
    }
  });

  testCase("FakeXMLHttpRequestSetResponseBodySyncTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/", false);
      this.xhr.send();
      this.xhr.setResponseHeaders({});
    },

    "should not throw": function () {
      var xhr = this.xhr;

      assertNoException(function () {
        xhr.setResponseBody("");
      });
    },

    "should set readyState to DONE": function () {
      this.xhr.setResponseBody("");

      assertEquals(sinon.FakeXMLHttpRequest.DONE, this.xhr.readyState);
    },

    "should throw if responding to request twice": function () {
      var xhr = this.xhr;
      this.xhr.setResponseBody("");

      assertException(function () {
        xhr.setResponseBody("");
      });
    },

    "should not call onreadystatechange for sync request": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      var spy = sinon.spy();
      xhr.onreadystatechange = spy;
      xhr.open("GET", "/", false);
      xhr.send();
      var callCount = spy.callCount;

      xhr.setResponseHeaders({});
      xhr.setResponseBody("");

      assertEquals(0, callCount - spy.callCount);
    },

    "should simulate synchronous request": function () {
      var xhr = new sinon.FakeXMLHttpRequest();

      xhr.onSend = function () {
        this.setResponseHeaders({});
        this.setResponseBody("Oh yeah");
      };

      xhr.open("GET", "/", false);
      xhr.send();

      assertEquals("Oh yeah", xhr.responseText);
    }
  });

  testCase("FakeXMLHttpRequestRespondTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
      var spy = this.spy = sinon.spy();

      this.xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          spy.call(this);
        }
      };

      this.xhr.send();
    },

    "should call readystate handler with readyState DONE once": function () {
      this.xhr.respond(200, {}, "");

      assertEquals(1, this.spy.callCount);
    },

    "should default to status 200, no headers, and blank body": function () {
      this.xhr.respond();

      assertEquals(200, this.xhr.status);
      assertEquals({}, this.xhr.getAllResponseHeaders());
      assertEquals("", this.xhr.responseText);
    },

    "should set status": function () {
      this.xhr.respond(201);

      assertEquals(201, this.xhr.status);
    },

    "should set headers": function () {
      sinon.spy(this.xhr, "setResponseHeaders");
      var responseHeaders = { some: "header", value: "over here" };
      this.xhr.respond(200, responseHeaders);

      assertEquals(responseHeaders, this.xhr.setResponseHeaders.args[0][0]);
    },

    "should set response text": function () {
      this.xhr.respond(200, {}, "'tis some body text");

      assertEquals("'tis some body text", this.xhr.responseText);
    }
  });

  testCase("FakeXMLHttpRequestGetResponseHeaderTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
    },

    "should return null if request is not finished": function () {
      assertNull(this.xhr.getResponseHeader("Content-Type"));
    },

    "should return null if header is Set-Cookie": function () {
      this.xhr.send();

      assertNull(this.xhr.getResponseHeader("Set-Cookie"));
    },

    "should return null if header is Set-Cookie2": function () {
      this.xhr.send();

      assertNull(this.xhr.getResponseHeader("Set-Cookie2"));
    },

    "should return header value": function () {
      this.xhr.send();
      this.xhr.setResponseHeaders({ "Content-Type": "text/html" });

      assertEquals("text/html", this.xhr.getResponseHeader("Content-Type"));
    },

    "should return null if header is not set": function () {
      this.xhr.send();

      assertNull(this.xhr.getResponseHeader("Content-Type"));
    }
  });

  testCase("FakeXMLHttpRequestGetAllResponseHeadersTest", {
    setUp: function () {
      this.xhr = new sinon.FakeXMLHttpRequest();
      this.xhr.open("GET", "/");
    },

    "should return null if request is not finished": function () {
      assertNull(this.xhr.getAllResponseHeaders());
    },

    "should not return Set-Cookie and Set-Cookie2 headers": function () {
      this.xhr.send();
      this.xhr.setResponseHeaders({
        "Set-Cookie": "Hey",
        "Set-Cookie2": "There"
      });

      assertEquals({}, this.xhr.getAllResponseHeaders());
    },

    "should return headers": function () {
      this.xhr.send();
      this.xhr.setResponseHeaders({
        "Content-Type": "text/html",
        "Set-Cookie2": "There",
        "Content-Length": "32"
      });

      assertEquals({
        "Content-Type": "text/html",
        "Content-Length": "32"
      }, this.xhr.getAllResponseHeaders());
    }
  });

  var globalXMLHttpRequest = this.XMLHttpRequest;
  var globalActiveXObject = this.ActiveXObject;

  testCase("SinonStubXHRTest", {
    setUp: function () {
      this.fakeXhr = sinon.useFakeXMLHttpRequest();
    },

    tearDown: function () {
      if (typeof this.fakeXhr.restore == "function") {
        this.fakeXhr.restore();
      }
    },

    "should return FakeXMLHttpRequest constructor": function () {
      assertSame(sinon.FakeXMLHttpRequest, this.fakeXhr);
    },

    "should temporarily bless FakeXMLHttpRequest with restore method": function () {
      assertFunction(this.fakeXhr.restore);
    },

    "calling restore should remove temporary method": function () {
      this.fakeXhr.restore();

      assertUndefined(this.fakeXhr.restore);
    },

    "should replace global XMLHttpRequest": function () {
      assertSame(sinon.FakeXMLHttpRequest, XMLHttpRequest);
    },

    "should restore global XMLHttpRequest": function () {
      this.fakeXhr.restore();

      assertSame(globalXMLHttpRequest, XMLHttpRequest);
    },

    "should remove XMLHttpRequest onCreate listener": function () {
      sinon.FakeXMLHttpRequest.onCreate = function () {};

      this.fakeXhr.restore();

      assertUndefined(sinon.FakeXMLHttpRequest.onCreate);
    },

    "should optionally keep XMLHttpRequest onCreate listener": function () {
      var onCreate = function () {};
      sinon.FakeXMLHttpRequest.onCreate = onCreate;

      this.fakeXhr.restore(true);

      assertSame(onCreate, sinon.FakeXMLHttpRequest.onCreate);
    },

    "should restore global ActiveXObject": function () {
      this.fakeXhr.restore();

      assertSame(globalActiveXObject, global.ActiveXObject);
    },

    "should throw when creating ActiveX Microsoft.XMLHTTP": function () {
      assertException(function () {
        new ActiveXObject("Microsoft.XMLHTTP");
      });
    },

    "should throw when creating ActiveX Msxml2.XMLHTTP": function () {
      assertException(function () {
        new ActiveXObject("Msxml2.XMLHTTP");
      });
    },

    "should throw when creating ActiveX Msxml2.XMLHTTP.3.0": function () {
      assertException(function () {
        new ActiveXObject("Msxml2.XMLHTTP.3.0");
      });
    },

    "should throw when creating ActiveX Msxml2.XMLHTTP.6.0": function () {
      assertException(function () {
        new ActiveXObject("Msxml2.XMLHTTP.6.0");
      });
    }
  });
}(this));