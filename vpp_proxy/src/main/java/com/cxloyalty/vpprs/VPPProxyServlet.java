package com.cxloyalty.vpprs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.CookieStore;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.cookie.Cookie;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

@WebServlet(//@formatter:off
        urlPatterns = "/vpprs/*",
        initParams =
        {
            @WebInitParam(name = "vpprsHost", value = "https://www.myhost.com/app-root"),
            @WebInitParam(name = "proxyHost", value = ""),  //set to empty string for no proxy ...myproxy.com
            @WebInitParam(name = "proxyPort", value = "80"),
            @WebInitParam(name = "proxyScheme", value = "http")
        }
)//@formatter:on
public class VPPProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final boolean DEBUG = true;

	private static final String[] COPY_HEADERS = { HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION,
			HttpHeaders.ACCEPT };

	private static final List<String> COPY_RESPONSE_HEADERS = Arrays.asList(HttpHeaders.CONTENT_TYPE);

	private static CookieStore cookieStore = new BasicCookieStore();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		RequestBuilder rb = RequestBuilder.get();
		try {
			URI uri = new URIBuilder(request.getRequestURI()).build();
			List<NameValuePair> queryParams = URLEncodedUtils.parse(uri,
					Charset.forName(request.getCharacterEncoding()));
			if (queryParams != null && queryParams.size() > 0) {
				for (NameValuePair queryParam : queryParams) {
					rb.addParameter(queryParam);
				}
			}
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		execute(rb, request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		RequestBuilder rb = RequestBuilder.post();
		StringBuilder sb = new StringBuilder();
		String json = null;
		try {
			BufferedReader reader = request.getReader();
			while ((json = reader.readLine()) != null) {
				sb.append(json);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		StringEntity entity = new StringEntity(sb.toString(), "UTF-8");
		rb.setEntity(entity);
		execute(rb, request, response);
	}

	private String getURL(HttpServletRequest request) {
		return getServletConfig().getInitParameter("vpprsHost") + request.getPathInfo();
	}

	private void execute(RequestBuilder rb, HttpServletRequest request, HttpServletResponse response) {
		CloseableHttpClient httpClient = HttpClients.custom().setDefaultCookieStore(cookieStore).build();
		checkProxy(rb, request);
		setHeaders(rb, request);
		rb.setUri(getURL(request));
		rb.build();
		try {
			HttpResponse httpResponse = httpClient.execute(rb.build());
			handleResponse(rb, httpResponse, response);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				httpClient.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	private void setHeaders(RequestBuilder rb, HttpServletRequest request) {
		for (String header : COPY_HEADERS) {
			if (request.getHeader(header) != null) {
				rb.setHeader(header, request.getHeader(header));
			}
		}
	}

	private void checkProxy(RequestBuilder rb, HttpServletRequest request) {
		String proxyHost = getServletConfig().getInitParameter("proxyHost");
		if (proxyHost != null && !"".equals(proxyHost)) {
			RequestConfig.Builder requestConfigBuilder = RequestConfig.custom();
			HttpHost proxy = new HttpHost(proxyHost, Integer.valueOf(getServletConfig().getInitParameter("proxyPort")),
					getServletConfig().getInitParameter("proxyScheme"));
			requestConfigBuilder.setProxy(proxy);
			rb.setConfig(requestConfigBuilder.build());
		}
	}

	private void handleResponse(RequestBuilder rb, HttpResponse httpResponse, HttpServletResponse response) {
		try {
			StatusLine statusLine = httpResponse.getStatusLine();
			HttpEntity entity = httpResponse.getEntity();
			InputStream is = entity.getContent();
			StringBuilder sb = new StringBuilder();
			try (Reader reader = new BufferedReader(
					new InputStreamReader(is, Charset.forName(StandardCharsets.UTF_8.name())))) {
				int c = 0;
				while ((c = reader.read()) != -1) {
					sb.append((char) c);
				}
			} finally {
				is.close();
			}
			if (DEBUG) {
				System.out.println("#############################################################################");
				System.out.println("Request: " + rb.getUri());
				System.out.println("Response SC: " + statusLine.getStatusCode());
				System.out.println("Response Body: " + sb.toString());
				if (cookieStore.getCookies().size() > 0) {
					for (Cookie cookie : cookieStore.getCookies()) {
						System.out.println("Cookie: " + cookie.getName() + " : " + cookie.getValue());
					}
				}
			}
			forwardResponse(statusLine.getStatusCode(), sb.toString(), httpResponse.getAllHeaders(), response);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void forwardResponse(int statusCode, String body, Header[] headers, HttpServletResponse response)
			throws IOException {
		response.setStatus(statusCode);
		for (Header header : headers) {
			if (COPY_RESPONSE_HEADERS.contains(header.getName())) {
				response.addHeader(header.getName(), header.getValue());
			}
		}
		response.getWriter().append(body);
	}

}
