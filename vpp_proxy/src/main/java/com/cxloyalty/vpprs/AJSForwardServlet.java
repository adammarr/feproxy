package com.cxloyalty.vpprs;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(//@formatter:off
        urlPatterns = "/ajs/*",
        initParams =
        {
            @WebInitParam(name = "welcomePage", value = "/index.html")
        }
)//@formatter:on
public class AJSForwardServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		RequestDispatcher dispatcher = getServletContext()
				.getRequestDispatcher(getServletConfig().getInitParameter("welcomePage"));
		dispatcher.forward(request, response);
	}

}
