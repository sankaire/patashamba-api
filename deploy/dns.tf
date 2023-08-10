data "aws_route53_zone" "zone" {
  name = "${var.dns_zone_name}."
}


# create new record within route 53
resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = "${lookup(var.subdomain, terraform.workspace)}.${data.aws_route53_zone.zone.name}"
  type    = "CNAME" # (canonical name) link domain to another domain. A REcord -> link record to an IP address
  ttl     = "300"   # time to refresh if a change to domain happens

  records = [aws_lb.api.dns_name]
}

#  SSL/TlS certificate for HTTPS
resource "aws_acm_certificate" "cert" {
  domain_name = aws_route53_record.app.fqdn # full domain name for our env e.g api.staging.credistock.net (fully qualified domain name fqdn)
  # when creating a cert you need to validate you own that domain
  validation_method = "DNS"

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

# record for domain validation
resource "aws_route53_record" "cert_validation" {
  name    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.zone.zone_id
  records = [
    aws_acm_certificate.cert.domain_validation_options.0.resource_record_value
  ]
  ttl = "60"
}

# triggers validation proccess of dns in aws
resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [aws_route53_record.cert_validation.fqdn]
}
