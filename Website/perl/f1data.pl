#!/usr/bin/perl

use strict;
use warnings;

use LWP::UserAgent;
use HTTP::Cookies;
use HTML::Parse;
use HTML::Element;

use JSON;

my $f1prefix = "http://www.formula1.com";

my $json = JSON->new->utf8;

my $ua = LWP::UserAgent->new();

my $cookies = HTTP::Cookies->new(
    file => "cookies.txt",
    autosave => 1,
    );

$ua->cookie_jar($cookies);

# Pretend to be Internet Explorer.
$ua->agent("Windows IE 10.0");

sub main 
{
    my $response = getPage('http://www.formula1.com/races/calendar.html');
    parseCalendarData($response);
    getPage('http://www.formula1.com/races/in_detail/australia_893/circuit_diagram.html');
}

sub getPage {
    my $url = $_[0];
    my $response = $ua->get($url);

    if ($response->is_success) {
        print "Retrieved " . 
                      length($response->decoded_content) . 
                      " bytes of data.\n";
	HTML::Parse::parse_html($response->decoded_content);
    }
    else {
        print "Error: " . $response->status_line;	
    }
}

sub parseCalendarData {
    my $calendarData = $_[0];

    my @elements = $calendarData->look_down('class', 'raceCalender'); # nice typo f1.com :)

    my @descendants = $elements[0]->descendants();

    for (@descendants) {
	my $tagname = $_->tag;
	if ($tagname =~ 'td') {	    
	    my $tagtype = $_->attr_get_i('class');
	    my $taglink;
	    print $tagtype . "\n";
	    print $_->as_text . "\n"; 
	    for(@{ $_->extract_links('a', 'href')}) {
		my($link, $element, $attr, $tag) = @$_;
		$taglink = $f1prefix.$link;
	    }
	    print $taglink . "\n";

	    if ($tagtype =~ 'raceLocation') {
		my $detailpage = getPage($taglink);
		my $circuitinfobox = $detailpage->look_down('class', 'circuitInfoBox')->as_HTML;
		my $qualifyingtime = $detailpage->look_down('id', 'CT_Time_2_3');
		my $racetime = $detailpage->look_down('id', 'CT_Time_3_1');
		print $qualifyingtime->as_HTML . "\n";
		print $racetime->as_HTML . "\n";
	    }
	}
    }
}

main();
