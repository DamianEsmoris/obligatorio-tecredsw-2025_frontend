FROM rockylinux:9

RUN dnf install httpd git -y && \
    dnf clean all && \
    rm -rf /var/cache/dnf

RUN echo "" > /etc/httpd/conf.d/welcome.conf && \
    echo "" > /etc/httpd/conf.d/userdir.conf && \
    echo "" > /etc/httpd/conf.d/autoindex.conf

RUN cat <<EOF > /etc/httpd/conf.d/default.conf
DirectoryIndex index.php index.html
ErrorLogFormat "[HTTPD_ERROR_LOG] [%{u}t] [%-m:%l] [pid %P:tid %T] %7F: %E: [client\ %a] %M% ,\ referer\ %{Referer}i"
ErrorLog /dev/stderr

LogFormat "[HTTPD_ACCESS_LOG] %h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
CustomLog /dev/stdout combined

<VirtualHost *:80>
    DocumentRoot /var/www/html/
    DirectoryIndex index.php index.html

    ErrorLog /dev/stderr
    CustomLog /dev/stdout combined
</VirtualHost>
EOF

COPY --chmod=0544 start.sh /start.sh

ENTRYPOINT ["/start.sh"]
