Pod::Spec.new do |s|
  s.name = 'LiftoryCloud'
  s.version = '1.0.0'
  s.summary = 'Private CloudKit sync for Liftory'
  s.description = 'Native transport for local workout records.'
  s.license = { :type => 'Proprietary' }
  s.author = 'Liftory'
  s.homepage = 'https://example.com/liftory'
  s.source = { :git => '' }
  s.platforms = { :ios => '16.4' }
  s.swift_version = '5.9'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'CloudKit'
  s.source_files = '**/*.swift'
end
